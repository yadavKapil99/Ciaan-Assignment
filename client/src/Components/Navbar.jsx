import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // <-- added
import url from '../constant';
import { setUser } from "../store/userSlice";
import {
  Blocks,X,
  FileText,
  UserPlus,
  UserCircle,
  LogOut,
  MessageCircleMore, 
} from 'lucide-react';

const Navbar = ({ toggleNavbar, isOpen }) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    if (toggleNavbar) toggleNavbar();
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${url}/users/logout`, {}, { withCredentials: true });
      dispatch(setUser(null));
      dispatch(setAllPosts(null));
      dispatch(setLikedPosts([]));
      dispatch(setCommentPosts([]));
      navigate('/login');
      if (toggleNavbar) toggleNavbar(); // close if mobile
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col h-[99vh] w-full md:w-[30%] lg:w-[25%] min-w-[300px] p-4 bg-white shadow-md">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Blocks className="text-indigo-600" />
          <h2 className="text-xl font-bold">Nexora</h2>
        </div>
      </div>

      {/* Menu Items */}
      <h3 className="text-lg font-semibold mb-3">Main Menu</h3>
      <ul className="pl-2 flex flex-col gap-2 text-sm">
        <li onClick={() => handleNavigate('/')} className={`cursor-pointer flex items-center gap-2 p-2 rounded ${isActive('/') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
          <FileText size={18} /> Home
        </li>
        <li onClick={() => handleNavigate('/people')} className={`cursor-pointer flex items-center gap-2 p-2 rounded ${isActive('/people') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
          <UserPlus size={18} /> People
        </li>
        <li onClick={() => handleNavigate('/user-profile')} className={`cursor-pointer flex items-center gap-2 p-2 rounded ${isActive('/user-profile') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
          <UserCircle size={18} /> Profile
        </li>
        <li onClick={() => handleNavigate('/my-posts')} className={`cursor-pointer flex items-center gap-2 p-2 rounded ${isActive('/my-posts') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
          <MessageCircleMore size={18} /> My Posts
        </li>
      </ul>

      {/* Profile Summary */}
      {user && (
        <div className="mt-6 p-4 rounded-xl border bg-gray-50 text-sm shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img src={user.profilePicture} alt="Profile" className="w-12 h-12 rounded-full object-cover border" />
            <div>
              <p className="font-semibold text-base">{user.userName}</p>
              <p className="text-gray-500 text-xs">{user.email}</p>
            </div>
          </div>
          {user.bio && <p className="text-gray-700 text-sm italic border-l-2 border-indigo-400 pl-2">{user.bio}</p>}
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <div><strong>{user.posts?.length || 0}</strong> <span className="ml-1 text-gray-500">Posts</span></div>
            <div><strong>{user.connections?.length || 0}</strong> <span className="ml-1 text-gray-500">Connections</span></div>
          </div>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
};

export default Navbar;
