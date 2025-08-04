import React, { useEffect, useState } from 'react';
import { getUserDetails } from '../Api/Post';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import url from '../constant';
import Post from '../Components/Post/Post';

const Profile = () => {
  const { userId } = useParams();
  const loggedInUser = useSelector((state) => state.user.user);

  const [profileUser, setProfileUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const result = await getUserDetails(userId);
      if (result.success) {
        setProfileUser(result.user);
        setIsConnected(loggedInUser?.connections?.includes(userId));
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const res = await axios.post(`${url}/connections`, { connectedTo: userId }, { withCredentials: true });
      if (res.data.success) {
        setIsConnected(res.data.connected);
      }
    } catch (err) {
      console.error('Connection failed:', err);
      alert('Error while connecting.');
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  if (loading || !profileUser) {
    return <div className="text-center py-10 text-gray-500">Loading profile...</div>;
  }

  const isOwnProfile = loggedInUser?._id === profileUser._id;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Top Profile Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white p-6 rounded-lg shadow">
        <img
          src={profileUser.profilePicture}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{profileUser.userName}</h2>
          <p className="text-sm text-gray-500">{profileUser.email}</p>
          <p className="mt-2 text-gray-700">{profileUser.bio}</p>
          <p className="text-xs text-gray-400 mt-1">{profileUser.role}</p>

          {!isOwnProfile && (
            <button
              onClick={handleConnect}
              className={`mt-4 px-4 py-1 text-sm rounded border ${
                isConnected
                  ? 'bg-green-100 text-green-600 border-green-400'
                  : 'bg-blue-100 text-blue-600 border-blue-400'
              }`}
            >
              {isConnected ? 'Connected' : 'Connect'}
            </button>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Posts</h3>
        {profileUser.posts && profileUser.posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {profileUser.posts.map((post) => (
              <Post key={post._id} post={post} pic={profileUser.profilePicture} repost={false} follow={false} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
