// models/user.js
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
   username: { type: String, required: true, unique: true },
  settings: {
    tempo: { type: Number, default: 120 },
    scale: { type: String, default: "C" },        // ✅ rename from instrument
    transpose: { type: Number, default: 0 },
    enableBeats: { type: Boolean, default: false },
    beatMode: { type: String, default: "1loop" },
   instruments: { type: Object, default: { piano: true } }
    // ✅ store activeInstruments map
  }

}, { timestamps: true }); // adds createdAt & updatedAt
  

// add passport-local-mongoose plugin (handles hashing, salting, etc.)
userSchema.plugin(passportLocalMongoose);

// export the model safely (avoids overwrite errors in dev)
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
