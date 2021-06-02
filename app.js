const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;
const DB_CONNECTION = process.env.DB_CONNECTION;

const student = require("./routes/Student");
const homeOwners = require("./routes/HomeOwners");

app.use(express.json());
app.use("/api/students", student);
app.use("/api/homeOwners", homeOwners);

mongoose
  .connect(DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log("couldn't connect to mongo DB ", err));

app.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}...`);
});
