import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 50,
    },
    profilePicture: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 3,
    },
    role: {
      type: String,
      enum: ["Student", "Working Professional"],
      default: "Student",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },
    posts:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ],
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
