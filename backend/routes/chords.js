const express = require("express");
const { getSettings, saveSettings, resetSettings } = require("../controllers/chordController");
const { isAuthenticated } = require("../middleware/auth"); // or your middleware path

const router = express.Router();

router.get("/last", isAuthenticated, getSettings);
router.post("/save", isAuthenticated, saveSettings);
router.post("/reset", isAuthenticated, resetSettings);

module.exports = router;
