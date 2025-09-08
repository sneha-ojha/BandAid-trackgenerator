import React, { useState, useEffect } from "react";
import { registerUser } from "./api"; // Correctly import the real API function

const Register = ({ onRegister, onSwitchToLogin, onSwitchToHome }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [taglineAnimationComplete, setTaglineAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTaglineAnimationComplete(true);
    }, 1500); // Duration of fade-in-down animation
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Registering...");
    try {
      const res = await registerUser(formData);
      setMessage(res.message || "User registered successfully!");
      if (onRegister) onRegister(res.user);
    } catch (err) {
      const msg = err.error || "Something went wrong";
      setMessage("Error: " + msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0E] text-white relative overflow-hidden px-4 font-michroma">
      {/* Animated background particles and grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 bg-purple-700 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500 rounded-full opacity-10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-3xl animate-pulse-fast"></div>
        <div className="absolute inset-0 bg-repeat opacity-5" style={{
          backgroundImage: 'linear-gradient(to right, rgba(168,85,247,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(168,85,247,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}></div>
      </div>

      {/* BAND-AID heading */}
      <h1
        className="absolute top-10 text-6xl font-extrabold tracking-wider text-white z-10 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 animate-text-gradient">BandAid</span>
      </h1>

      {/* Tagline with combined animation */}
      <p
        className={`absolute top-28 text-lg text-gray-300 font-semibold whitespace-nowrap z-10 overflow-hidden ${taglineAnimationComplete ? 'animate-marquee' : 'animate-fade-in-down-once'}`}
      >
        Your handy and easy-to-use track generator. Get your track in just a few clicks - Anytime. Anywhere.
      </p>

      {/* Dark neon-styled card */}
      <div className="w-full max-w-xl mt-44 bg-gray-800/90 backdrop-blur-md p-16 rounded-3xl transition-all duration-500 z-10 relative overflow-hidden group border border-purple-700/50"
        style={{
          boxShadow: '0 0 50px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,0,0,0.2)',
          border: 'none',
        }}
      >
        <h2 className="text-4xl font-extrabold text-white text-center mb-6 tracking-widest drop-shadow-md relative z-10">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 rounded-xl bg-gray-900 text-gray-100 placeholder-gray-400 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 shadow-inner shadow-black/50"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 rounded-xl bg-gray-900 text-gray-100 placeholder-gray-400 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 shadow-inner shadow-black/50"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-extrabold shadow-lg shadow-pink-500/30 transition-all duration-500 transform hover:scale-105 relative"
          >
            Register
          </button>
        </form>

        <p className={`mt-4 text-center font-semibold relative z-10 ${message.startsWith("Error") ? 'text-red-400' : 'text-green-400'}`}>{message}</p>

        <p className="mt-6 text-center text-gray-400 font-medium relative z-10">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-pink-400 hover:text-purple-400 underline-offset-4 hover:underline transition-colors duration-300"
          >
            Login here
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

      {/* Keyframes and font import */}
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

export default Register;
