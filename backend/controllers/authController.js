const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });
    await User.register(user, password);
    res.json({ message: "User registered successfully", user: { username: user.username, id: user._id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Logged out successfully" });
  });
};

exports.me = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  try {
    const user = await User.findById(req.user._id).select("username settings");
    res.json({ user: { id: user._id, username: user.username, settings: user.settings } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
