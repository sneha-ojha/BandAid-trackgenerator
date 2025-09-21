import React, { useState } from "react";
import { loginUser } from "../api"; // Correctly import the real API function

const Login = ({ onLogin, onSwitchToRegister, onSwitchToHome }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");
    try {
      // ✅ Use the real loginUser function
      const res = await loginUser(formData);
      setMessage(res.message || "Login successful!");
      // On successful login, trigger the onLogin prop with user info
      if (onLogin) onLogin(res.user);
    } catch (err) {
      const msg = err.error || "Something went wrong";
      setMessage("Error: " + msg);
    }
  };

  return (
    <div className="min-h-screen flex text-white relative font-michroma overflow-hidden bg-[#0A0A0E]">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-900 via-transparent to-transparent">
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
          <h1
            className="text-6xl font-extrabold text-white leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 animate-text-gradient">BandAid</span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 text-center leading-relaxed max-w-md animate-fade-in-up">
 
            <span className="block mt-2">Login to start generating your tracks -</span>
            <span className="block mt-1">anytime, anywhere.</span>
          </p>
        </div>

        {/* Right login form */}
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-10 bg-gray-900/80 backdrop-blur-md rounded-l-3xl shadow-2xl relative">
          <div className="w-full max-w-md p-8 rounded-2xl border border-purple-700/50 shadow-lg glow-border-on-hover">
            {/* Animated line on top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-b-lg animate-pulse-slow"></div>

            <h2 className="text-4xl font-bold text-center text-white mb-8 mt-4 tracking-widest drop-shadow-md">
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
                className="w-full px-5 py-4 rounded-xl bg-gray-900 text-gray-100 placeholder-gray-400 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 transform focus:scale-[1.02] shadow-inner shadow-black/50"
              />
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 rounded-xl bg-gray-900 text-gray-100 placeholder-gray-400 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 transform focus:scale-[1.02] shadow-inner shadow-black/50"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-extrabold shadow-lg shadow-pink-500/30 transition-all duration-500 transform hover:scale-105 relative"
              >
                Login
              </button>
            </form>

            {message && (
              <p className={`mt-4 text-center font-semibold relative z-10 ${message.startsWith("Error") ? 'text-red-400' : 'text-green-400'}`}>
                {message}
              </p>
            )}

            <p className="mt-6 text-center text-gray-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-pink-400 hover:text-purple-400 underline-offset-4 hover:underline transition-colors duration-300"
              >
                Register here
              </button>
              <span className="mx-2 text-gray-600">|</span>
              <button
                type="button"
                onClick={onSwitchToHome}
                className="text-pink-400 hover:text-purple-400 underline-offset-4 hover:underline transition-colors duration-300"
              >
                Go to Home
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

        @keyframes fade-in-down-once {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
        }

        @keyframes fade-in-out {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes pulse-fast {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-fade-in-down-once {
          animation: fade-in-down-once 1.5s ease-out forwards;
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite alternate;
        }
        .animate-pulse-fast {
          animation: pulse-fast 3s ease-in-out infinite alternate;
        }
        @keyframes text-gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-text-gradient {
          background-size: 200% auto;
          animation: text-gradient 3s linear infinite alternate;
        }
      `}</style>
    </div>
  );
};
export default Login;
