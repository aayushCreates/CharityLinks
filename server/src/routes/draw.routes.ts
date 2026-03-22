import { Router } from "express";
import * as drawController from "../controllers/draw.controller";
import { isUserLoggedIn, isAdmin, hasActiveSubscription } from "../middlewares/auth.middleware";

const drawRouter = Router();

// Admin only routes for managing draws
drawRouter.post("/simulate", isUserLoggedIn, isAdmin, drawController.simulateDraw);
drawRouter.post("/publish", isUserLoggedIn, isAdmin, drawController.publishDraw);

// Accessible to all logged-in users with a subscription
drawRouter.get("/latest", isUserLoggedIn, hasActiveSubscription, drawController.getLatestDraw);

export default drawRouter;
