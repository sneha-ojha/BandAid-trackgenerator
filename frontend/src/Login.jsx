import React, { useState } from "react";

// Mock API functions for a self-contained component
const loginUser = async (formData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Logging in user:", formData.username);
  if (!formData.username || !formData.password) {
    throw new Error("Username and password cannot be empty.");
  }
  return { message: "Login successful!" };
};

const getProfile = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { username: "logged-in-user", email: "user@example.com" };
};

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");
    try {
      const res = await loginUser(formData);
      setMessage(res.message || "Login successful!");
      const profile = await getProfile();
      if (onLogin) onLogin(profile);
    } catch (err) {
      const msg = err.error || err.message || "Something went wrong";
      setMessage("Error: " + msg);
    }
  };

  return (
    <div className="min-h-screen flex text-white relative font-michroma overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 via-purple-900 to-black">
        {/* Particle/Grid animation layer */}
        <div className="absolute inset-0 opacity-10 animate-pulse">
          <div className="absolute inset-0 bg-repeat" style={{ 
            backgroundImage: 'radial-gradient(circle, #5b21b6 1px, transparent 1px), radial-gradient(circle, #ec4899 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col lg:flex-row w-full z-10">
        {/* Left branding section */}
        <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-12 bg-transparent">
          <h1 className="text-6xl font-extrabold text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] transition-all duration-500 transform hover:scale-105 hover:rotate-2">
            BandAid
          </h1>
          <p className="mt-6 text-xl text-purple-200 text-center leading-relaxed max-w-md animate-fade-in-up">
            <span className="block">Drop the beat 🎶</span>
            <span className="block mt-2">Login to start generating your tracks —</span>
            <span className="block mt-1">anytime, anywhere.</span>
          </p>
        </div>

        {/* Right login form */}
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-10 bg-gray-900/80 backdrop-blur-md rounded-l-3xl shadow-2xl relative">
          <div className="w-full max-w-md p-8 rounded-2xl border-2 border-purple-700/50 shadow-lg glow-border-on-hover">
            {/* Animated line on top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-b-lg animate-pulse-slow"></div>

            <h2 className="text-4xl font-bold text-center text-purple-300 mb-8 mt-4 tracking-widest drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
              Login to BandAid
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 rounded-xl bg-gray-800 text-purple-100 placeholder-purple-400 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 transform focus:scale-[1.02] shadow-md"
              />
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 rounded-xl bg-gray-800 text-purple-100 placeholder-purple-400 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 transform focus:scale-[1.02] shadow-md"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-extrabold shadow-lg shadow-purple-800/70 transition-all duration-300 transform hover:scale-105 relative glow-on-hover"
              >
                Login
              </button>
            </form>

            {message && (
              <p className="mt-4 text-center font-semibold relative z-10 text-green-400 animate-fade-in-out">
                {message}
              </p>
            )}

            <p className="mt-6 text-center text-purple-300">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-pink-400 hover:text-purple-200 underline-offset-4 hover:underline transition-colors duration-300"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Keyframes and custom styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');
        
        .font-michroma {
            font-family: 'Michroma', sans-serif;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .glow-on-hover {
          position: relative;
          z-index: 0;
          overflow: hidden;
        }
        .glow-on-hover:before {
          content: '';
          background: linear-gradient(45deg, #ec4899, #06b6d4);
          position: absolute;
          top: -2px;
          left: -2px;
          background-size: 400%;
          z-index: -1;
          filter: blur(8px);
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          animation: glowing-button 20s linear infinite;
          opacity: 0;
          transition: opacity .3s ease-in-out;
          border-radius: 12px;
        }
        .glow-on-hover:hover:before {
          opacity: 1;
        }
        @keyframes glowing-button {
          0% { background-position: 0 0; }
          50% { background-position: 400% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
    </div>
  );
};

export default Login;
