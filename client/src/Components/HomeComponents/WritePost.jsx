import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import url from '../../constant';

const WritePost = ({ setWritePost }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const total = images.length + files.length;

    if (total > 5) {
      alert("You can upload up to 5 images only.");
      return;
    }

    const filePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...filePreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("content", message);

      // Append each image file
      for (const img of images) {
        formData.append("images", img.file);
      }

      const response = await axios.post(`${url}/posts/`, formData, { withCredentials: true });
      if(response.data.success){
        alert("Post created SuccessFully");
        dispatch(setUser(response.data.user));
        setMessage("");
        setImages([]);
        setWritePost(false);
      }

    } catch (error) {
      console.error("Failed to submit post:", error);
      alert("Something went wrong while posting.");
    }
  };

  return (
    <div className="flex flex-col items-center w-[600px] bg-white overflow-y-auto px-1 md:px-10 py-8 rounded-lg shadow-md">
      {/* Close Button */}
      <div className="w-full flex justify-end">
        <button onClick={() => setWritePost(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" className="lucide lucide-x">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Post Card */}
      <div className="flex flex-col gap-4 p-4 w-full rounded-lg border">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <img
            src={user?.profilePicture}
            alt="Profile"
            className="w-[60px] h-[60px] rounded-full object-cover"
          />
          <span className="font-semibold">{user?.userName || "Anonymous"}</span>
        </div>

        {/* Message Input */}
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border rounded-md p-2 outline-none resize-none"
        />

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.preview}
                  alt="Preview"
                  className="w-[80px] h-[80px] object-cover rounded"
                />
                <button
                  className="absolute top-0 right-0 bg-white rounded-full p-1 text-xs"
                  onClick={() => removeImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-between items-center mt-2">
          <label className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 cursor-pointer">
            Add Images
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
            />
          </label>

          <button
            onClick={handlePost}
            disabled={message.trim() === "" && images.length === 0}
            className={`px-4 py-2 rounded text-white transition 
              ${message.trim() === "" && images.length === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'}
            `}
          >
            Post
          </button>

        </div>
      </div>
    </div>
  );
};

export default WritePost;
