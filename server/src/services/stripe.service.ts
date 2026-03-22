import Stripe from "stripe";
import {
  PrismaClient,
  SubscriptionType,
  SubscriptionStatus,
} from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia" as any,
});

const PRICE_IDS = {
  MONTHLY: process.env.STRIPE_MONTHLY_PRICE_ID as string,
  YEARLY: process.env.STRIPE_YEARLY_PRICE_ID as string,
};

export const createCheckoutSession = async (
  userId: string,
  type: SubscriptionType
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: PRICE_IDS[type],
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
    client_reference_id: userId,
    customer_email: user.email,
    metadata: {
      userId,
      planType: type,
    },
  });

  console.log("session of chekcout: ", session);

  return session.url;
};

export const handleWebhook = async (payload: Buffer, sig: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
    console.log("event after checkout: ", event);
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await onSubscriptionCompleted(session);
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await onSubscriptionUpdated(subscription);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await onSubscriptionDeleted(subscription);
      break;
    }
  }
};

const onSubscriptionCompleted = async (session: Stripe.Checkout.Session) => {
  const userId = session.client_reference_id;
  const stripeSubscriptionId = session.subscription as string;
  const stripeCustomerId = session.customer as string;
  const planType = session.metadata?.planType as SubscriptionType;

  if (!userId) return;

  const subscription = (await stripe.subscriptions.retrieve(
    stripeSubscriptionId
  )) as Stripe.Subscription;

  await prisma.subscription.create({
    data: {
      userId,
      stripeSubscriptionId,
      stripeCustomerId,
      type: planType || "MONTHLY",
      status: "ACTIVE",
      amount: session.amount_total ? session.amount_total / 100 : 0,
      startDate: new Date((subscription as any).current_period_start * 1000),
      endDate: new Date((subscription as any).current_period_end * 1000),
    },
  });
};

const onSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
  const status =
    subscription.status === "active"
      ? SubscriptionStatus.ACTIVE
      : SubscriptionStatus.INACTIVE;

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status,
      endDate: new Date((subscription as any).current_period_end * 1000),
    },
  });
};

const onSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: "INACTIVE",
    },
  });
};
