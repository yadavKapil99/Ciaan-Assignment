import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/Login';
import SignUp from './Pages/SignUp';
import Home from './Pages/Home';
import ProtectedRoute from './Components/ProtectedRoute';
import MyPosts from './Pages/MyPosts';
import UserProfile from './Pages/UserProfile';
import People from './Pages/People';
import Profile from './Pages/Profile';

export default function App() {
  return (
    <Routes>
      {/* Public Routes (No Navbar) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes (With Navbar) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/people" element={<People />} />
        <Route path="/profile/:userId" element={<Profile />} />
        {/* Add more protected pages here */}
      </Route>
    </Routes>
  );
}
