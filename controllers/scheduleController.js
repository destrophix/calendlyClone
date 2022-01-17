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

exports.getSchedule = bigPromise(async (req, res, next) => {
  const schedules = await Schedule.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    schedules,
  });
});
