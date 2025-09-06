import axios from "axios";

// Backend base URL (matches your server)
const API = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // ✅ sends cookies automatically
});

// ------------------- AUTH -------------------

// Register a new user
export const registerUser = async (userData) => {
  try {
    const res = await API.post("/auth/register", userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Registration failed" };
  }
};

// Login user
export const loginUser = async (userData) => {
  try {
    const res = await API.post("/auth/login", userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Login failed" };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const res = await API.post("/auth/logout");
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Logout failed" };
  }
};

// Get logged-in user profile
export const getProfile = async () => {
  try {
    const res = await API.get("/auth/me");
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Not authenticated" };
  }
};

// ------------------- CHORD SETTINGS -------------------

// Get current user's chord settings
export const getSettings = async () => {
  try {
    const res = await API.get("/chords/last"); // ✅ GET request
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch settings" };
  }
};

// Save/update chord settings
export const saveSettings = async (settings) => {
  try {
    const res = await API.post("/chords/save", settings); // ✅ POST request
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to save settings" };
  }
};

// Reset chord settings to defaults
export const resetSettings = async () => {
  try {
    const res = await API.post("/chords/reset"); // ✅ POST request
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to reset settings" };
  }
};
