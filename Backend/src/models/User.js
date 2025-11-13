import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: 
    { 
    type: String, 
    required: true, 
    unique: true 
    },
    name: 
    { 
    type: String, 
    required: true 
    },
    email: 
    { 
    type: String, 
    required: true, 
    unique: true 
    },
    avatar: 
    { 
    type: String 
    },                 // Google profile picture
    timezone: 
    { 
    type: String, 
    default: "UTC" 
    } // Optional, useful for bookings
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const User = mongoose.model("User", userSchema);

export default User;
