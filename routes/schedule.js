const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middlewares/user");

const {
  createSchedule,
  getSchedule,
  getSchedules,
  bookSlot,
  deleteSlot,
  deleteSchedule,
} = require("../controllers/scheduleController");

router.route("/schedule/create").post(isLoggedIn, createSchedule);
router.route("/schedule/delete").post(isLoggedIn, deleteSchedule);
router.route("/schedule/:scheduleId").get(getSchedule);
router.route("/schedules").get(isLoggedIn, getSchedules);
router.route("/bookslot/").post(bookSlot);
router.route("/deleteslot/").post(deleteSlot);

module.exports = router;
