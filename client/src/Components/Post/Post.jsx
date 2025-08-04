import React, { useState } from 'react';
import {
  Heart,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Repeat,
  Trash2,
} from 'lucide-react';
import axios from 'axios';
import url from '../../constant';
import { useDispatch, useSelector } from 'react-redux';
import { setLikedPosts, setAllPosts } from '../../store/postSlice';
import { getUserPosts } from '../../Api/Post';
import Comment from './Comment';

const Post = ({ post, pic, onDelete, setLocalPosts }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const currentUserId = user?._id;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const likedPosts = useSelector((state) => state.posts.likedPosts) || [];
  const [liked, setLiked] = useState(likedPosts.includes(post._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  const [connections, setConnections] = useState(user?.connections || []);

  const isNotMyPost = post.author?._id !== currentUserId;
  const isConnected = connections.includes(post.author._id);
  const totalImages = post.images?.length || 0;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const handleLike = async () => {
    try {
      const res = await axios.post(`${url}/likes/${post._id}/like`, {}, { withCredentials: true });
      if (res.data.success) {
        const isNowLiked = res.data.liked;
        setLiked(isNowLiked);
        setLikeCount((prev) => prev + (isNowLiked ? 1 : -1));

        const updatedLikes = isNowLiked
          ? [...likedPosts, post._id]
          : likedPosts.filter((id) => id !== post._id);
        dispatch(setLikedPosts(updatedLikes));
      }
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleRepost = async (post) => {
    try {
      const res = await axios.post(`${url}/posts/repost`, { post }, { withCredentials: true });
      if (res.data.success) {
        alert('Reposted successfully!');
      }
    } catch (err) {
      console.error('Repost failed:', err);
      alert('Error while reposting');
    }
  };

  const handleDeletePost = async () => {
    const confirm = window.confirm('Are you sure you want to delete this post?');
    if (!confirm) return;

    try {
      const res = await axios.delete(`${url}/posts/${post._id}`, { withCredentials: true });
      if (res.data.success) {
        alert('Post deleted successfully!');
        const result = await getUserPosts();
        if (result.success) {
          dispatch(setAllPosts(result.posts));
          setLocalPosts(result.posts);
        } else {
          alert(result.message || "Could not fetch posts");
        }
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete post');
    }
  };

  const handleConnect = async () => {
    try {
      const res = await axios.post(
        `${url}/connections`,
        { connectedTo: post.author._id },
        { withCredentials: true }
      );

      if (res.data.success) {
        if (res.data.connected) {
          // Added
          setConnections((prev) => [...prev, post.author._id]);
        } else {
          // Removed
          setConnections((prev) => prev.filter((id) => id !== post.author._id));
        }
        alert(res.data.message);
      }
    } catch (err) {
      console.error('Connection failed:', err);
      alert('Error while connecting');
    }
  };

  const handleNavigate  = (personId) => {
    window.location.href = `/profile/${personId}`;
  };

  return (
    <div key={post._id} className="relative bg-white p-6 rounded-lg shadow max-w-2xl w-full">
      {/* Delete Icon */}
      {post.author?._id === currentUserId && (
        <button
          onClick={handleDeletePost}
          className="absolute top-5 right-5 text-gray-400 hover:text-red-500"
        >
          <Trash2 size={18} />
        </button>
      )}

      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={post.author?.profilePicture || pic}
          alt="Author"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div onClick={()=>handleNavigate(post.author._id)}>
          <p className="font-semibold text-base">{post.author?.userName}</p>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Content */}
      {post.content && <p className="text-[15px] mb-3">{post.content}</p>}

      {/* Carousel */}
      {totalImages > 0 && (
        <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden rounded-md bg-black mb-4">
          <img
            src={post.images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {totalImages > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow"
                onClick={prevSlide}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow"
                onClick={nextSlide}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-4 text-xs text-gray-500 mb-3">
        <p>
          <strong>{likeCount}</strong> Likes
        </p>
        <p>
          <strong>{comments?.length || 0}</strong> Comments
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-6 text-gray-600 text-sm items-center mb-2">
        <button
          className={`flex items-center gap-1 hover:text-indigo-600 ${liked ? 'text-pink-500' : ''}`}
          onClick={handleLike}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} /> Like
        </button>

        <button
          className="flex items-center gap-1 hover:text-indigo-600"
          onClick={() => setShowComments(prev => !prev)}
        >
          <MessageCircle size={16} /> Comment
        </button>

        {isNotMyPost && (
          <button
            className="flex items-center gap-1 hover:text-indigo-600"
            onClick={() => handleRepost(post)}
          >
            <Repeat size={16} /> Repost
          </button>
        )}

        {isNotMyPost && (
          <button
            className="flex items-center gap-1 hover:text-indigo-600"
            onClick={handleConnect}
          >
            <UserPlus size={16} />
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
        )}
      </div>

      {showComments && (
        <Comment post={post} comments={comments} setComments={setComments} />
      )}
    </div>
  );
};

export default Post;
