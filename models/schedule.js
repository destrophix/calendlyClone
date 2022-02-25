const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Please enter a date."],
  },
  startTime: {
    type: Date,
    required: [true, "Please enter start time of your meeting."],
  },
  numberOfSlots: {
    type: Number,
    required: [true, "Please enter the number of slots"],
  },
  duration: {
    type: Number,
    required: [true, "Please enter the duration of a meeting"],
  },
  breakTime: {
    type: Number,
    default: 0,
  },
  bookedSlots: [
    {
      attendeeInfo: {
        name: String,
        email: String,
      },
      slot: {
        type: Number,
        required: [true, "slot no. is required"],
      },
    },
  ],
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
