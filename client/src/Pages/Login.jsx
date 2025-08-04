import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import axios from "axios";
import url from "../constant";
import studentImage from "../../assets/student.png"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${url}/users/login`,
        { email, password },
        { withCredentials: true }
      );
      const data = await res.data;
      if (res.status !== 200) throw new Error(data.message);

      dispatch(setUser(data.user));
      navigate("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center lg:flex-row bg-gradient-to-br from-[#0f0f0f] to-[#111827] text-white font-poppins">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden p-4">
        <div className="z-10 text-center space-y-6">
          <h1 className="text-4xl xl:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent animate-typing whitespace-nowrap overflow-hidden border-r-4 border-cyan-400 pr-4">
            Nexora vX
          </h1>
          <p className="text-lg text-gray-300 px-4">
            Connect to your robotic future. Secure. Intelligent. Fast.
          </p>
          <img
            src={studentImage}
            alt="Student Got Job"
            className="h-[400px] bg-gradient-to-br from-[#0f0f0f] to-[#111827] mx-auto "
          />


        </div>
        <div className="absolute w-full h-full bg-[radial-gradient(#2563eb33_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-md bg-[#1f2937]/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-blue-800/40 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
            Log in to Nexora
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition duration-300 transform hover:scale-105 text-sm"
            >
              {loading ? "Authenticating..." : "Log In"}
            </button>
          </form>

          <p className="text-xs sm:text-sm text-center text-gray-400 mt-6">
            Don’t have an account?{" "}
            <span
              className="text-cyan-400 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
