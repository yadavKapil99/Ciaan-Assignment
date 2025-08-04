import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Image, Menu } from 'lucide-react';
import axios from 'axios';
import url from '../constant';
import Post from '../Components/Post/Post';
import WritePost from '../Components/HomeComponents/WritePost';
import { getUserDetails } from '../Api/Post';
import { setAllPosts } from '../store/postSlice';
import { setUser } from '../store/userSlice';

const LIMIT = 5;

const Home = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [writePost, setWritePost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const loadingRef = useRef(false); 

  // Fetch posts
  const fetchPosts = async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;

    try {
      const res = await axios.get(`${url}/posts/allPosts?page=${page}&limit=${LIMIT}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAllPosts(res.data.posts))
        setPosts((prev) => [...prev, ...res.data.posts]);
        setHasMore(res.data.posts.length === LIMIT);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      loadingRef.current = false;
    }
  };

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loadingRef.current) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore]
  );

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchUserDetails = async () => {
      try {
        const result = await getUserDetails(user?._id);
        if (result.success) {
          dispatch(setUser(result.user))
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  return (
    <div className="flex flex-col relative items-center h-screen bg-gray-300 overflow-y-auto px-1 md:px-10 py-8">
      {/* Create Post Input */}
      <div
        onClick={() => setWritePost(true)}
        className="flex relative gap-2 p-2 border w-full rounded-lg bg-white"
      >
        <img src={user?.profilePicture} alt="Profile" className="w-10 h-10 rounded-full" />
        <input
          type="text"
          className="flex-1 outline-none"
          placeholder="What's in your mind?"
          readOnly
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Image />
        </div>
      </div>

      {/* Write Post Modal */}
      {writePost && (
        <div className="fixed w-full inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Suspense fallback={<div className="text-white text-lg">Loading...</div>}>
            <WritePost setWritePost={setWritePost} />
          </Suspense>
        </div>
      )}

      {/* Posts */}
      <div className="flex flex-col gap-4 w-full max-w-2xl mt-5">
        {posts.map((post) => (
          <Post key={post._id} post={post} setLocalPosts={setPosts} />
        ))}

        {hasMore && (
          <div ref={loaderRef} className="text-gray-600 text-center py-4">
            Loading more posts...
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="text-gray-500 text-center py-4">No more posts to load.</div>
        )}
      </div>
    </div>
  );
};

export default Home;
