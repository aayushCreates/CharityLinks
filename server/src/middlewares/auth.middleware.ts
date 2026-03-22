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

    // Attach user to request
    req.user = user as any;

    next();
  } catch (err) {
    console.error("Error in auth middleware:", err);
    return res.status(500).json({ 
        success: false, 
        message: "Server error in authentication" 
    });
  }
};

/**
 * Middleware to check if the user has an active subscription.
 * Required for protected features like score entry and draw participation.
 */
export const hasActiveSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as any;
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        // Check if user has an active subscription
        const activeSubscription = user.subscriptions?.length > 0 ? user.subscriptions[0] : null;

        if (!activeSubscription) {
            return res.status(403).json({
                success: false,
                message: "Active subscription required to access this feature",
                requiresSubscription: true
            });
        }

        next();
    } catch (err) {
        console.error("Error in subscription middleware:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Server error in subscription validation" 
        });
    }
};

/**
 * Middleware to check if the user is an administrator.
 */
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as any;
        
        if (!user || !user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Admin access required",
            });
        }

        next();
    } catch (err) {
        console.error("Error in admin middleware:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Server error in admin validation" 
        });
    }
};
