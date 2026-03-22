import { Request, Response } from "express";
import * as charityService from "../services/charity.service";

export const getCharities = async (req: Request, res: Response) => {
  try {
    const charities = await charityService.getAllCharities();
    res.status(200).json({
      success: true,
      data: charities,
    });
  } catch (err) {
    console.error("Error in getCharities controller:", err);
    res.status(500).json({
      success: false,
      message: "Server error in fetching charities",
    });
  }
};

export const getCharity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Charity ID is required",
        });
    }
    const charity = await charityService.getCharityById(id as string);
    if (!charity) {
      return res.status(404).json({
        success: false,
        message: "Charity not found",
      });
    }
    res.status(200).json({
      success: true,
      data: charity,
    });
  } catch (err) {
    console.error("Error in getCharity controller:", err);
    res.status(500).json({
      success: false,
      message: "Server error in fetching charity",
    });
  }
};
