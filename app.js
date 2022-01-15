const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//routers
const user = require("./routes/user");

require("dotenv").config();

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", user);

app.get("/", (req, res) => {
  res.send("hello");
});

module.exports = app;
