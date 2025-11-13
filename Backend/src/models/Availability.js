import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, 
    
    dayOfWeek: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 6 
    }, 
    slots: [
      {
        start: 
        { 
        type: String, 
        required: true 
        }, // "09:00"
        end: 
        { 
        type: String, 
        required: true 
        },   // "12:00"
      }
    ]
  },
  { 
    timestamps: true 
}
);

const Availability = mongoose.model("Availability", availabilitySchema);

export default Availability;
