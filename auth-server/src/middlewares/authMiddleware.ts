import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (req.cookies?.token) {
    try {
      token = req.cookies.token;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
      const user = await User.findById(decoded.id).select("-password");
      req.user = user as IUser;

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
