const mongoose = require("mongoose");
const Schedule = require("../models/schedule");
const bigPromise = require("../middlewares/bigPromise");

exports.createSchedule = bigPromise(async (req, res, next) => {
  const { date, startTime, numberOfSlots, duration, breakTime } = req.body;

  if (!date || !startTime || !numberOfSlots || !duration) {
    return next(
      new Error("Date, startTime, numberofSlots, duration are mandatory")
    );
  }

  let schedule = await Schedule.findOne({
    user: req.user,
    date,
  });

  if (schedule) {
    return next(new Error("You cannot create duplicate meetings"));
  }

  schedule = await Schedule.create({
    ...req.body,
    user: req.user,
  });

  res.status(200).json({
    success: true,
    schedule,
  });
});

exports.deleteSchedule = bigPromise(async (req, res, next) => {
  const schedule = await Schedule.findOne({
    _id: req.body.scheduleId,
    user: req.user._id,
  });

  if (!schedule) {
    return next(new Error("schedule does not exist"));
  }

  await Schedule.findByIdAndDelete(req.body.scheduleId);

  res.status(200).json({
    success: true,
    msg: "schedule deleted",
  });
});

exports.getSchedule = bigPromise(async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.scheduleId);

  res.status(200).json({
    success: true,
    schedule,
  });
});

exports.getSchedules = bigPromise(async (req, res, next) => {
  console.log(req.user._id);
  const schedules = await Schedule.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    schedules,
  });
});

exports.bookSlot = bigPromise(async (req, res, next) => {
  const schedule = await Schedule.findOne({ _id: req.body.scheduleId });

  if (!schedule) {
    return next(new Error("Schedule doesn't exist"));
  }

  if (schedule.numberOfSlots < req.body.slot) {
    return next(new Error("Slot does not exist"));
  }

  let alreadyBooked = false;
  schedule.bookedSlots.forEach((ele) => {
    if (
      ele.slot == req.body.slot ||
      ele.attendeeInfo.email == req.body.attendeeInfo.email
    ) {
      alreadyBooked = true;
      return next(new Error("slot already booked"));
    }
  });

  if (alreadyBooked) {
    return next(new Error("slot already booked"));
  }

  schedule.bookedSlots.push({
    attendeeInfo: req.body.attendeeInfo,
    slot: req.body.slot,
  });

  await schedule.save();

  // console.log(schedule);

  res.status(200).json({
    success: true,
    msg: "slot booked",
  });
});

exports.deleteSlot = bigPromise(async (req, res, next) => {
  const schedule = await Schedule.findById(req.body.scheduleId);

  if (!schedule) {
    return next(new Error("slot doesn't exist"));
  }

  schedule.bookedSlots = schedule.bookedSlots.filter(
    (ele) => ele.attendeeInfo.email !== req.body.email
  );
  await schedule.save();

  res.status(200).json({
    success: true,
    msg: "slot deleted",
  });
});
