import { Request, Response } from "express";
import * as scoreService from "../services/score.service";

export const createScore = async (req: Request, res: Response) => {
  try {
    const { value, date } = req.body;
    const user = req.user as any;

    if (!value || !date) {
      return res.status(400).json({
        success: false,
        message: "Score value and date are required",
      });
    }

    const scoreDate = new Date(date);
    const score = await scoreService.addScore(user.id, value, scoreDate);

    res.status(201).json({
      success: true,
      message: "Score added successfully",
      data: score,
    });
  } catch (err: any) {
    console.error("Error in createScore controller:", err);
    res.status(400).json({
      success: false,
      message: err.message || "Server error in adding score",
    });
  }
};

export const getScores = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const scores = await scoreService.getUserScores(user.id);

    res.status(200).json({
      success: true,
      data: scores,
    });
  } catch (err) {
    console.error("Error in getScores controller:", err);
    res.status(500).json({
      success: false,
      message: "Server error in fetching scores",
    });
  }
};
