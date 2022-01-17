const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//routers
const user = require("./routes/user");
const schedule = require("./routes/schedule");

require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", user);
app.use("/api/v1", schedule);

app.get("/", (req, res) => {
  res.send("hello");
});

module.exports = app;
