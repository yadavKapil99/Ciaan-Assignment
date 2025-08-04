import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import url from "../constant";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    role: "",
    profilePicture: null,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      const file = files[0];
      setFormData({ ...formData, profilePicture: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const validateStep1 = () => {
    const newErrors = {};
    const { userName, email, password, confirmPassword } = formData;

    if (!userName) newErrors.userName = "Username is required.";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email address.";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { bio, role } = formData;

    if (!bio || !role) {
      setErrors({
        ...errors,
        bio: !bio ? "Bio is required." : "",
        role: !role ? "Role is required." : "",
      });
      return;
    }

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formPayload.append(key, value);
    });

    try {
      const response = await axios.post(`${url}/users/`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        dispatch(setUser(response.data.user));
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Sign up failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] to-[#111827] text-white font-poppins px-4">
      <div className="w-full max-w-md bg-[#1f2937]/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-blue-800/40 shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
          Sign Up to Nexora
        </h2>

        {step === 1 && (
          <form className="space-y-4">
            <div>
              <input
                type="text"
                name="userName"
                placeholder="Username"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-cyan-500"
                value={formData.userName}
                onChange={handleChange}
              />
              {errors.userName && (
                <p className="text-red-400 text-xs mt-1">{errors.userName}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-cyan-500"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-cyan-500"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-2.5 right-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-cyan-500"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-2.5 right-3 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition duration-300 transform hover:scale-105"
            >
              Next
            </button>

            <p className="text-xs sm:text-sm text-center text-gray-400 mt-6">
              Already have an account?{" "}
              <span
                className="text-cyan-400 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Profile Image</label>
              <div className="flex items-center space-x-3">
                <label className="flex items-center gap-2 cursor-pointer bg-gray-800 px-4 py-2 rounded-md border border-gray-700 hover:bg-gray-700 transition text-sm">
                  <Upload size={16} />
                  Upload
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-10 h-10 rounded-full object-cover border border-cyan-500"
                  />
                )}
              </div>
            </div>

            <div>
              <textarea
                name="bio"
                placeholder="Tell us about yourself"
                rows="4"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-cyan-500"
                value={formData.bio}
                onChange={handleChange}
              />
              {errors.bio && (
                <p className="text-red-400 text-xs mt-1">{errors.bio}</p>
              )}
            </div>

            <div>
              <select
                name="role"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-cyan-500"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Working Professional">Working Professional</option>
              </select>
              {errors.role && (
                <p className="text-red-400 text-xs mt-1">{errors.role}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition duration-300 transform hover:scale-105"
            >
              Sign Up
            </button>

            <p className="text-xs sm:text-sm text-center text-gray-400 mt-6">
              Already have an account?{" "}
              <span
                className="text-cyan-400 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
