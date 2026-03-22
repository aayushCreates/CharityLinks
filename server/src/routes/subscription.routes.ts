import express, { Router } from "express";
import * as stripeController from "../controllers/stripe.controller";
import { isUserLoggedIn } from "../middlewares/auth.middleware";

const subscriptionRouter = Router();

// Endpoint for Stripe Webhooks (must be public)
// Note: This route requires raw body parsing, handled in server.ts
subscriptionRouter.post("/webhook", express.raw({ type: "application/json" }), stripeController.stripeWebhook);

// Checkout endpoint
subscriptionRouter.post("/checkout", express.json(), isUserLoggedIn, stripeController.initiateCheckout);

export default subscriptionRouter;
