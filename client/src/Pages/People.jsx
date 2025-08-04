import React, { useEffect, useState } from 'react';
import axios from 'axios';
import url from '../constant';
import { useSelector } from "react-redux";

const People = () => {
  const user = useSelector((state) => state.user.user);
  const [searchInput, setSearchInput] = useState('');
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState(user?.connections || []);

  const fetchLatestPeople = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/users/getLatestUsers`, { withCredentials: true });
      if (res.data.success) {
        setPeople(res.data.users.slice(0, 10));
      }
    } catch (err) {
      console.error('Failed to fetch latest people:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchPeople = async (query) => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/users/search/${query}`, { withCredentials: true });
      if (res.data.success) {
        setPeople(res.data.users);
      }
    } catch (err) {
      console.error('Failed to search people:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (personId) => {
    try {
      const res = await axios.post(
        `${url}/connections`,
        { connectedTo: personId },
        { withCredentials: true }
      );

      if (res.data.success) {
        if (res.data.connected) {
          setConnections((prev) => [...prev, personId]);
        } else {
          setConnections((prev) => prev.filter((id) => id !== personId));
        }
      }
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  };

  const handleShowProfile = (personId) => {
    window.location.href = `/profile/${personId}`;
  };

  useEffect(() => {
    if (searchInput.trim() === '') {
      fetchLatestPeople();
    } else {
      const delayDebounce = setTimeout(() => {
        searchPeople(searchInput);
      }, 300);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchInput]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className='w-full  flex items-center justify-center'>
      <h2 className="text-xl font-semibold mb-4">Search People</h2>

      </div>
      <input
        type="text"
        placeholder="Search by username or email..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="w-full p-2 border rounded-md mb-6"
      />

      {loading ? (
        <p className="text-center text-sm text-gray-500">Loading...</p>
      ) : people.length === 0 ? (
        <p className="text-center text-sm text-gray-500">No people found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {people
            .filter((person) => person._id !== user?._id) // exclude self
            .map((person) => {
              const isConnected = connections.includes(person._id);
              return (
                <div
                  key={person._id}
                  onClick={() => handleShowProfile(person._id)}
                  className="flex flex-col sm:flex-row items-center justify-between border p-3 rounded-md bg-white shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={person.profilePicture}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{person.userName}</p>
                      <p className="text-sm text-gray-500">{person.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConnect(person._id)}
                    className={`px-3 py-1 text-sm rounded-md border ${
                      isConnected
                        ? 'bg-green-100 text-green-600 border-green-300'
                        : 'bg-blue-100 text-blue-600 border-blue-300'
                    }`}
                  >
                    {isConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default People;
