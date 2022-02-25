const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//routers
const user = require("./routes/user");
const schedule = require("./routes/schedule");

require("dotenv").config();

//docs
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();

// app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptionsDelegate = function (req, callback) {
  let corsOptions = {
    origin: "http://localhost:3000",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  };
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use("/api/v1", cors(corsOptionsDelegate), user);
app.use("/api/v1", schedule);

app.get("/", (req, res) => {
  res.send("hello");
});

module.exports = app;
