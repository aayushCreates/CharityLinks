import { Router } from "express";
import * as scoreController from "../controllers/score.controller";
import { isUserLoggedIn, hasActiveSubscription } from "../middlewares/auth.middleware";

const scoreRouter = Router();

// Both routes require login and an active subscription as per PRD
scoreRouter.use(isUserLoggedIn);
scoreRouter.use(hasActiveSubscription);

scoreRouter.post("/", scoreController.createScore);
scoreRouter.get("/", scoreController.getScores);

export default scoreRouter;
