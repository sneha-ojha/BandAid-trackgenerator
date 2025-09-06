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
    // Use findByIdAndUpdate for a more robust update
    // This allows Mongoose to validate and save the sub-document correctly
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { settings: req.body } },
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
// controllers/chordController.js
exports.resetSettings = async (req, res) => {
  try {
    const defaults = {
      tempo: 120,
      scale: "C",
      transpose: 0,
      enableBeats: false,
      beatMode: "1loop",
      instruments: { piano: true }
    };

const updatedUser = await User.findByIdAndUpdate(
  req.user._id,
  { $set: Object.fromEntries(Object.entries(req.body).map(([key, value]) => [`settings.${key}`, value])) },
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
