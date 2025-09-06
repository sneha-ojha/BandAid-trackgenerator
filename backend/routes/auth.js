const express = require("express");
const passport = require("passport");
const { register, logout, me } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ error: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ message: "Login successful", user: { username: user.username, id: user._id } });
    });
  })(req, res, next);
});

router.post("/logout", logout);
router.get("/me", me);

module.exports = router;
