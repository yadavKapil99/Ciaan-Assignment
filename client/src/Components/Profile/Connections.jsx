import axios from 'axios';
import React, { useState, useEffect } from 'react';
import url from '../../constant';

const Connections = ({ user, setShowConnections }) => {
  const [connectionDetails, setConnectionDetails] = useState([]);

  const getConnections = async () => {
    try {
      const response = await axios.get(`${url}/connections/${user._id}`, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        setConnectionDetails(data.connections);
      }
    } catch (error) {
      console.error('Failed to fetch connections:', error);
    }
  };

  const handleDisconnect = async (connectedUserId) => {
    try {
      const res = await axios.post(
        `${url}/connections`,
        { connectedTo: connectedUserId },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Remove from list
        setConnectionDetails((prev) =>
          prev.filter((conn) => conn._id !== connectedUserId)
        );
        alert(res.data.message);
      }
    } catch (err) {
      console.error('Disconnect failed:', err);
      alert('Error while disconnecting');
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (connectionDetails.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500">
        No connections yet.
      </div>
    );
  }

  return (
    <div className="bg-white p-4 min-w-[300px] rounded-lg max-h-[400px] overflow-y-auto shadow w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Connections</h2>
        <button
          onClick={() => setShowConnections(false)}
          className="text-sm text-blue-500 hover:underline"
        >
          Close
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {connectionDetails.map((conn) => (
          <div
            key={conn._id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div className="flex items-center gap-3">
              <img
                src={conn.profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="text-sm font-medium">{conn.userName}</p>
            </div>
            <button
              onClick={() => handleDisconnect(conn._id)}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Unfollow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
