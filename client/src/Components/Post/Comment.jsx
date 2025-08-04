import React, { useState, useEffect } from 'react';
import axios from 'axios';
import url from '../../constant';
import { useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';

const Comment = ({ post, comments, setComments }) => {
  const postId = post._id;
  const user = useSelector((state) => state.user.user);
  const currentUserId = user?._id;
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
      try {
        const res = await axios.get(`${url}/comments/${postId}`, { withCredentials: true });
        if (res.data.success) {
          setComments(res.data.comments);
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${url}/comments/`,
        { content: comment, postId },
        { withCredentials: true }
      );

      if (res.data.success) {
        setComment('');
        await fetchComments();
      }
    } catch (err) {
      console.error('Comment failed:', err);
    } finally {
      setLoading(false);
    }
  };

    const handleDeleteComment = async (commentId) => {
        console.log("Deleting comment:", commentId);
        if (!window.confirm("Are you sure you want to delete this comment?")) return;    
        try {
            const res = await axios.delete(
                `${url}/comments/${commentId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setComments((prev) => prev.filter((c) => c._id !== commentId));
            }
        } catch (err) {
            console.error('Comment Delete failed:', err);
        }
  };



  return (
    <div className="border-t pt-4 mt-4 text-sm text-gray-800">
      {/* Add Comment */}
      <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 border rounded-md"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!user}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-3 py-2 rounded-md text-xs"
          disabled={!comment.trim() || loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>

      {/* Comment List */}
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {comments.map((c, idx) => (
            <div key={idx} className="flex items-start gap-3 relative">
              <img
                src={c.author?.profilePicture || "/default-avatar.png"}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{c.author?.userName || "Anonymous"}</p>
                <p className="text-gray-600">{c.content}</p>
              </div>
              {post.author?._id === currentUserId && (
                <button
                  onClick={() => handleDeleteComment(c._id)}
                  className="absolute top-5 right-5 text-gray-400 hover:text-red-500"
                >
                    <Trash2 size={18} />
                </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
