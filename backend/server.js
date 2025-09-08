const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const chordRoutes = require("./routes/chords");
const app = express();

// Middleware
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: "supersecretkey", // move to env var in prod
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,    // true only when using HTTPS
    sameSite: "lax",  // allow cookies in localhost dev
  }
}));


app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/chords", chordRoutes);
// DB + Server
mongoose.connect("mongodb://127.0.0.1:27017/chords", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(3000, () => console.log("Server running on http://localhost:3000"));
}).catch(err => console.error(err));
