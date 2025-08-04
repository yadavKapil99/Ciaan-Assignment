import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
    images: [
      {
      type: String,
      trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Custom validator: ensure at least content or image exists
postSchema.pre("validate", function (next) {
  if (!this.content && !this.image) {
    return next(new Error("Post must have at least text or an image."));
  }
  next();
});

export const Post = mongoose.model("Post", postSchema);
