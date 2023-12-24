import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    phone: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    profilePicture: {
      type: String,
    },
  },
  { timestamps: true }
);
export default mongoose.model("users", userSchema);
