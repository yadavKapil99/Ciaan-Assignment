import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { uploadImage } from "../utils/cloudinary.js";

// Generate JWT
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Step 1: Get user with password for validation
    const userWithPassword = await User.findOne({ email });
    if (!userWithPassword) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await userWithPassword.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Step 2: Re-fetch the user without the password
    const user = await User.findById(userWithPassword._id).select("-password"); 

    const accessToken = generateAccessToken(user._id);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true, 
    sameSite: "None", 
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    });


    return res.status(200).json({
      success: true,
      message: "Login successful",
      user, 
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
};

export const signUp = async (req, res) => {
  try {
    console.log("hii")
    const { email, password, userName, bio, role } = req.body;
    console.log("body",req.body)
    const file = req.file;

    console.log("fle",file)
    let profilePicture = "";
    if (file?.path) {
      profilePicture = await uploadImage(file.path); 
    }

    console.log("profle",profilePicture)

    if (!email || !password || !userName || !bio || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    console.log("exist",existingUser)

    const newUser = new User({
      email,
      password,
      userName,
      bio,
      role,
      profilePicture,
    });
    console.log("newUser",newUser)

    await newUser.save();

    console.log("saved")

    const accessToken = generateAccessToken(newUser._id);

    console.log("accessToken", accessToken)

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None" ,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    // Remove password from response
    const { password: _, ...userData } = newUser._doc;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong. Please try again." });
  }
};

export const logOut = async (req, res) => {
  console.log("Logging out user:", req.user);
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  });
  return res.json({ success: true, message: 'Logged out successfully' });
}

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('posts').select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId

    const user = await User.findById(userId).populate('posts').select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const getLatestUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(10).select("-password");

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get Latest Users Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.params;

    if (!query) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    const users = await User.find({
      $or: [
        { userName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select("-password");

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Search Users Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
