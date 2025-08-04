import React, { useEffect, useState } from 'react';
import { getUserDetails } from '../Api/Post';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/userSlice';
import Connections from '../Components/Profile/Connections';

const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [showModal, setShowModal] = useState(false);
  const [showConnections, setShowConnections] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const result = await getUserDetails(user?._id);
      if (result.success) {
        dispatch(setUser(result.user));
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (!user) {
    return <div className="text-center text-lg py-10">Loading profile...</div>;
  }

  const handleOpenModal = (type) => {
    setOpenModal({ ...openModal, [type]: true });
  };

  const renderUserList = () => {
    const list = modalType === 'followers' ? user.followers : user.following;
    return (
      <div className="bg-white rounded-lg shadow p-4 w-full max-w-sm mx-auto">
        <h2 className="text-lg font-semibold mb-4 capitalize">{modalType}</h2>
        {list?.length === 0 ? (
          <p className="text-sm text-gray-500">No {modalType} yet.</p>
        ) : (
          <ul className="divide-y">
            {list.map((id) => (
              <li key={id} className="py-2 text-sm text-gray-700">
                {id}
              </li>
            ))}
          </ul>
        )}
        <button
          className="mt-4 px-4 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          onClick={() => setShowModal(false)}
        >
          Close
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0 self-center sm:self-start">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-gray-200"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">{user.userName}</h2>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          <p className="mt-2 text-gray-700">
            <strong>Role:</strong> {user.role}
          </p>
          <p className="mt-1 text-gray-700">
            <strong>Bio:</strong> {user.bio || 'No bio added.'}
          </p>

          <div className="mt-4 flex gap-6 text-sm text-gray-600">
            <button onClick={() => setShowConnections(true)} className="hover:underline">
              <strong>{user.connections?.length || 0}</strong> Connections
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className='mt-6 flex justify-center w-full'>
        {showConnections && <Connections user={user} setShowConnections={setShowConnections} />}

      </div>

    </div>
  );
};

export default UserProfile;
