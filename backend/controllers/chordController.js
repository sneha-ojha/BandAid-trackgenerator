// controllers/chordController.js
const User = require("../models/User");

// GET last saved chord settings
exports.getSettings = async (req, res) => {
  try {
    // We can rely on Passport.js to have already authenticated and populated req.user
    // The user model's schema defaults will provide values if settings are not present
    res.json(req.user.settings || {});
  } catch (err) {
    console.error("Get settings error:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

// SAVE chord settings
exports.saveSettings = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { settings: req.body } }, // This will replace the entire settings object
      { new: true, runValidators: true } // Return the updated document & run schema validators
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, settings: updatedUser.settings });
  } catch (err) {
    console.error("Save settings error:", err);
    res.status(500).json({ error: "Failed to save settings" });
  }
};

// RESET chord settings to defaults
exports.resetSettings = async (req, res) => {
  try {
    // Get default settings from the User schema
    const defaultSettings = new User().settings;
    
    // Find the user and update their settings with the defaults
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { settings: defaultSettings } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, settings: updatedUser.settings });
  } catch (err) {
    console.error("Reset settings error:", err);
    res.status(500).json({ error: "Failed to reset settings" });
  }
};
