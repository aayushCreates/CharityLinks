import { Request, Response } from "express";
import * as stripeService from "../services/stripe.service";

export const initiateCheckout = async (req: Request, res: Response) => {
  try {
    const { planType } = req.body;
    const user = req.user as any;

    if (!planType || (planType !== 'MONTHLY' && planType !== 'YEARLY')) {
      return res.status(400).json({
        success: false,
        message: "Plan type must be MONTHLY or YEARLY",
      });
    }

    const sessionUrl = await stripeService.createCheckoutSession(user.id, planType);

    res.status(200).json({
      success: true,
      data: { url: sessionUrl },
    });
  } catch (err: any) {
    console.error("Error in initiateCheckout controller:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error in initiating checkout",
    });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send("No stripe-signature found");
  }

  try {
    // For webhooks, Stripe needs the raw request body
    // Using req.body as Buffer (assuming express.raw middleware is used for this route)
    await stripeService.handleWebhook(req.body, sig as string);
    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
