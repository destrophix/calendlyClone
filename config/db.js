const mongoose = require("mongoose");

const connectWithDB = () => {
  mongoose
    .connect("mongodb://localhost:27017/test")
    .then(() => console.log("Connected to db."))
    .catch((err) => console.log(err));
};

module.exports = connectWithDB;
