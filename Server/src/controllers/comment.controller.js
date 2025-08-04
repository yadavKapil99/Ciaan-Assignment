import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";

export const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('author', 'userName profilePicture');
    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
}

// Create a new comment on a post
export const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;

    if (!content || !postId) {
      return res.status(400).json({
        success: false,
        message: "Comment content and post ID are required.",
      });
    }

    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const newComment = await Comment.create({
      content,
      post: postId,
      author: req.user._id,
    });

    // Optional: Add comment reference to Post.comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      comment: newComment,
    });
  } catch (error) {
    console.error("Create Comment Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    // Only comment author can delete
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment.",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    // Optional: Remove reference from post.comments
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
