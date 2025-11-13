import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    user: 
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, 
    title: 
    { 
      type: String, 
      required: true
    }, 
    description: 
    { 
    type: String 
    }, // optional
    duration: 
    { 
    type: Number, 
    required: true 
    }, // in minutes
    color: 
    { 
    type: String, 
    default: "#4F46E5" 
    }, // optional UI color
  },
  { 
    timestamps: true 
   }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
