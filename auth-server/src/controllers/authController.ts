import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import generateToken from "../utils/generateToken";
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user: IUser = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    const token = generateToken(user._id as string);

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Check for user email
  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id as string);

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  const user = req.user;

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
