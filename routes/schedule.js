const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middlewares/user");

const {
  createSchedule,
  getSchedule,
} = require("../controllers/scheduleController");

router.route("/schedule/create").post(isLoggedIn, createSchedule);
router.route("/schedules/").get(isLoggedIn, getSchedule);

module.exports = router;
