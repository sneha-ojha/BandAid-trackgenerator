import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.js";
import ChordSetting from "../models/chordSettings.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected...");

    await User.deleteMany();
    await ChordSetting.deleteMany();

    const user = new User({ username: "testuser" });
    await User.register(user, "123456"); // ✅ hashes password

    await ChordSetting.create({
      user: user._id,
      scale: "C",
      progression: ["C", "Am", "F", "G"],
      tempo: 120,
      instruments: ["piano"],
    });

    console.log("Seeding completed ✅");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
