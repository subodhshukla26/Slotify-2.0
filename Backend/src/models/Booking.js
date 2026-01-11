import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    // Which event type
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // Owner of the event
    guestName:
    {
      type: String,
      required: true
    },   // person booking
    guestEmail:
    {
      type: String,
      required: true
    },  // guest's email
    startTime:
    {
      type: Date,
      required: true
    },     // booking start
    endTime:
    {
      type: Date,
      required: true
    },       // booking end
    status: {
      type: String,
      enum: ["scheduled", "cancelled"],
      default: "scheduled"
    },
    meetLink: {
      type: String
    },
    calendarEventId: {
      type: String
    } // Google Calendar event ID for syncing
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
