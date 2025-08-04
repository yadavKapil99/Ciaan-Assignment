import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPosts as setReduxPosts } from "../store/postSlice";
import { getUserPosts } from '../Api/Post';
import Post from '../Components/Post/Post';

const MyPosts = () => {
  const dispatch = useDispatch();
  const reduxPosts = useSelector((state) => state.posts.posts);
  const [posts, setLocalPosts] = useState(reduxPosts || []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getUserPosts();
      if (res.success) {
        dispatch(setReduxPosts(res.posts));
        setLocalPosts(res.posts);
      } else {
        alert(res.message || "Could not fetch posts");
      }
    };

    fetchData();
  }, []);

  if (!posts || posts.length === 0) {
    return <div className="p-8">No posts available.</div>;
  }

  return (
    <div className="flex flex-col relative items-center h-screen bg-gray-300 overflow-y-auto md:px-10 py-8">
      <h1 className="text-xl font-bold mb-4">My Posts</h1>
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {posts.map((post) => (
          <Post key={post._id} post={post} setLocalPosts={setLocalPosts} />
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
