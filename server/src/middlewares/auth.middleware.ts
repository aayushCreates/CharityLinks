import { Request, Response, NextFunction } from "express";
import { validateToken } from "../utils/auth.utils";
import { findUserByEmail } from "../services/auth.service";

export const isUserLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token, please login",
      });
    }

    const decoded = await validateToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Session Expired, please login",
      });
    }

    const user = await findUserByEmail(decoded.email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error in auth middleware:", err);
    return res.status(500).json({ 
        success: false, 
        message: "Server error in authentication" 
    });
  }
};
