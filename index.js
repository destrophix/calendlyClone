const app = require("./app");
const connectWithDB = require("./config/db");
require("dotenv").config();

connectWithDB();

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
