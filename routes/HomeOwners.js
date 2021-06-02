const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();

const { HomeOwners, validateHomeOwners } = require("../models/HomeOwners");

//get all the homeOwners
router.get("/", (req, res) => {
  res.send("we are on home owners");
});

//register the home owners account
router.post("/", async (req, res) => {
  const { error } = validateHomeOwners(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let homeOwner = await HomeOwners.findOne({ email: req.body.email });
  if (homeOwner) return res.status(400).send("this user is already registerd");

  homeOwner = new HomeOwners(_.pick(req.body, ["email", "name", "password"]));
  const salt = await bcrypt.genSalt(10);
  homeOwner.password = await bcrypt.hash(homeOwner.password, salt);
  await homeOwner.save();
  res.status(200).send(_.pick(homeOwner, ["_id", "email", "name", "password"]));
});

module.exports = router;
