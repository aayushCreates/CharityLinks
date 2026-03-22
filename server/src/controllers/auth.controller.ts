import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phone, password, charityId, contributionPercent } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter the required fields",
      });
    }

    const result = await registerUser({ 
      name, 
      email, 
      phone, 
      password, 
      charityId, 
      contributionPercent 
    });

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: result.user,
      token: result.token,
    });
  } catch (err: any) {
    console.error("Error in the register user controller", err);
    return res.status(400).json({
      success: false,
      message: err.message || "Server Error in registration of user, please try again",
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter the required fields",
      });
    }

    const result = await loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result.user,
      token: result.token,
    });
  } catch (err: any) {
    console.error("Error in the login user controller", err);
    if (err.message === "Invalid Credentials") {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server Error in logging in user, please try again",
    });
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (err) {
    console.error("Error in the logout user controller", err);
    return res.status(500).json({
      success: false,
      message: "Server Error in logging out user, please try again",
    });
  }
};
