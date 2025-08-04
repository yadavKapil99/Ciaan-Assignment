import { Like } from "../models/like.model.js";
import { Post } from "../models/post.model.js";

// Like or Unlike a post
export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    // Check if already liked
    const existingLike = await Like.findOne({ post: postId, likedBy: userId });

    if (existingLike) {
      // Unlike the post
      await Like.findByIdAndDelete(existingLike._id);
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });

      return res.status(200).json({
        success: true,
        liked: false,
        message: "Post unliked successfully.",
      });
    }

    // Like the post
    await Like.create({ post: postId, likedBy: userId });
    await Post.findByIdAndUpdate(postId, {
      $addToSet: { likes: userId },
    });

    return res.status(200).json({
      success: true,
      liked: true,
      message: "Post liked successfully.",
    });
  } catch (error) {
    console.error("Like Post Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
