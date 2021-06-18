const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;
const DB_CONNECTION = process.env.DB_CONNECTION;

const students = require("./routes/students");
const homeOwners = require("./routes/homeOwners");
const post = require("./routes/post");
const bookmarks = require("./routes/bookmarks");
const admin = require("./routes/admin");
const auth = require("./routes/auth");

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/api/students", students);
app.use("/api/homeOwners", homeOwners);
app.use("/api/bookmarks", bookmarks);
app.use("/api/posts", post);
app.use("/api/admin", admin);
app.use("/api/auth", auth);

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
