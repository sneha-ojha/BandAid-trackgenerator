const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const chordRoutes = require("./routes/chords");
const collaborationRoutes = require("./routes/collaboration");
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server=http.createServer(app);
const io=new Server(server, {
  cors: {
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials: true
  }
});


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
app.use("/collaboration", collaborationRoutes);

// Collaboration logic
const collaborationSessions = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join collaboration', (collaborationId) => {
    socket.join(collaborationId);
    socket.collaborationId = collaborationId;

    if (!collaborationSessions[collaborationId]) {
      collaborationSessions[collaborationId] = {};
    }

    socket.emit('collaboration settings updated', collaborationSessions[collaborationId]);
  });

  socket.on('update collaboration settings', (settings) => {
    if (socket.collaborationId) {
      collaborationSessions[socket.collaborationId] = {
        ...collaborationSessions[socket.collaborationId],
        ...settings
      };
      io.to(socket.collaborationId).emit('collaboration settings updated', collaborationSessions[socket.collaborationId]);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


// DB + Server
mongoose.connect("mongodb://127.0.0.1:27017/chords", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  // Use server.listen() instead of app.listen()
  server.listen(3000, () => console.log("Server running on http://localhost:3000"));
}).catch(err => console.error(err));