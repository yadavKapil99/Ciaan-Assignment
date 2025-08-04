import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Upload } from "lucide-react"; // if using lucide icons
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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

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
  };

  const handleNext = () => {
    const { userName, email, password, confirmPassword } = formData;

    if (!userName || !email || !password || !confirmPassword) {
      alert("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { bio, role } = formData;

    if (!bio || !role) {
      alert("Please fill in all required fields");
      return;
    }

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formPayload.append(key, value);
    });

    try {
      const response = await axios.post( `${url}/users/`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        dispatch(setUser(response.data.user))
        navigate("/")
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
            <input
              type="text"
              name="userName"
              placeholder="Username"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-cyan-500"
              value={formData.userName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-cyan-500"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-cyan-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-2.5 right-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-cyan-500"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-2.5 right-3 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition duration-300 transform hover:scale-105"
            >
              Next
            </button>
            <p className="text-xs sm:text-sm text-center text-gray-400 mt-6">
              Do you have an account?{" "}
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

            <textarea
              name="bio"
              placeholder="Tell us about yourself"
              rows="4"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-cyan-500"
              value={formData.bio}
              onChange={handleChange}
              required
            />

            <select
              name="role"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-cyan-500"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="Student">Student</option>
              <option value="Working Professional">Working Professional</option>
            </select>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition duration-300 transform hover:scale-105"
            >
              Sign Up
            </button>

            <p className="text-xs sm:text-sm text-center text-gray-400 mt-6">
            Do you have an account?{" "}
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
