import { Router } from "express";
import * as charityController from "../controllers/charity.controller";

const charityRouter = Router();

charityRouter.get("/", charityController.getCharities);
charityRouter.get("/:id", charityController.getCharity);

export default charityRouter;
