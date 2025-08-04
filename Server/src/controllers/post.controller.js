import { Post } from "../models/post.model.js";
import { uploadImage } from "../utils/cloudinary.js";
import { User } from '../models/user.model.js';
import { Like } from '../models/like.model.js';
import { Comment } from '../models/comment.model.js';

// Create a Post (Text, Multiple Images, or Both)
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const files = req.files;
    const userId = req.user._id

    let imageUrls = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const url = await uploadImage(file.path); 
        imageUrls.push(url);
      }
    }

    if (!content && imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Post must contain either text or images.",
      });
    }

    const newPost = await Post.create({
      content,
      images: imageUrls,
      author: req.user._id,
    });

     await User.findByIdAndUpdate(
      userId,
      { $push: { posts: newPost._id } },
      { new: true }
    );

    const newUser = await User.findById(userId).populate('posts').select("-password");

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
      user: newUser
    });
  } catch (error) {
    console.error("Create Post Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// controllers/postController.js
export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "userName profilePicture") 

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      success: true,
      posts,
      totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (error) {
    console.error("Fetch posts failed:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



// Delete a Post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // 1. Fetch the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // 2. Verify ownership
    const currentUserId = req.user._id.toString();
    if (post.author.toString() !== currentUserId) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this post" });
    }

    // 3. Fetch user (optional, only if managing post reference array)
    const user = await User.findById(currentUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 4. Remove post reference from user's posts array
    const postIndex = user.posts.findIndex(id => id.toString() === postId.toString());
    if (postIndex !== -1) {
      user.posts.splice(postIndex, 1);
      await user.save();
    }

    // 5. Delete related likes
    await Like.deleteMany({ post: postId });

    // 6. Delete related comments
    await Comment.deleteMany({ post: postId });

    // 7. Finally, delete the post
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post and related data deleted successfully",
    });

  } catch (error) {
    console.error("Delete Post Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const posts = await Post.find({ author: userId })
      .populate('author', 'userName profilePicture')
      .sort({ createdAt: -1 })
      .lean(); 

    const modifiedPosts = posts.map(post => ({
      ...post,
      likedByUser: post.likes?.some(likeId => likeId.toString() === userId) || false,
    }));

    return res.status(200).json({
      success: true,
      message: "User posts fetched successfully",
      posts: modifiedPosts,
    });
  } catch (error) {
    console.error("Get User Posts Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const repostPost = async (req, res) => {
  try {
    const { post } = req.body;
    const userId = req.user._id;

    const newPost = await Post.create({
      content: post.content,
      images: post.images,
      author: req.user._id,
    });

    await User.findByIdAndUpdate(
      userId,
      { $push: { posts: newPost._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Post reposted successfully",
      post: newPost,
    });

  }catch (error) {
    console.error("Repost Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
