const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("we are on home");
});

app.listen(port, () => {
  console.log(`App is listening on Port ${port}...`);
});
