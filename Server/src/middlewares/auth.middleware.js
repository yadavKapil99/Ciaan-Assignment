import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and exclude password
    const user = await User.findById(decodedToken?.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized, please login again",
    });
  }
};
