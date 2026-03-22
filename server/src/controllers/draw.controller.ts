import { Request, Response } from "express";
import * as drawService from "../services/draw.service";

// In-memory simulation cache (Reset on server restart)
let lastSimulation: any = null;

export const simulateDraw = async (req: Request, res: Response) => {
  try {
    const { mode } = req.body; // 'RANDOM' | 'ALGORITHMIC'
    const simulation = await drawService.runDrawSimulation(mode || 'RANDOM');
    
    lastSimulation = simulation;

    res.status(200).json({
      success: true,
      message: "Draw simulation completed successfully",
      data: simulation,
    });
  } catch (err) {
    console.error("Error in simulateDraw controller:", err);
    res.status(500).json({
      success: false,
      message: "Server error in draw simulation",
    });
  }
};

export const publishDraw = async (req: Request, res: Response) => {
  try {
    if (!lastSimulation) {
      return res.status(400).json({
        success: false,
        message: "No simulation found. Run a simulation first.",
      });
    }

    const published = await drawService.publishDrawResults(lastSimulation);
    
    // Clear simulation cache after publishing
    lastSimulation = null;

    res.status(201).json({
      success: true,
      message: "Draw published successfully",
      data: published,
    });
  } catch (err) {
    console.error("Error in publishDraw controller:", err);
    res.status(500).json({
      success: false,
      message: "Server error in publishing draw",
    });
  }
};

export const getLatestDraw = async (req: Request, res: Response) => {
  try {
    const draw = await drawService.getLatestPublishedDraw();
    if (!draw) {
      return res.status(404).json({
        success: false,
        message: "No published draws found",
      });
    }

    res.status(200).json({
      success: true,
      data: draw,
    });
  } catch (err) {
    console.error("Error in getLatestDraw controller:", err);
    res.status(500).json({
      success: false,
      message: "Server error in fetching latest draw",
    });
  }
};
