const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();

const { HomeOwners, validateHomeOwners } = require("../models/HomeOwners");

//get all the homeOwners
router.get("/", async (req, res) => {
  const homeOwner = await HomeOwners.find();
  if (!homeOwner)
    return res.status(404).send("No registered home owners account yet");
  res.status(200).send(homeOwner);
});

//register the home owners account
router.post("/register", async (req, res) => {
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

//getting the current home owners
router.get("/:id", async (req, res) => {
  const homeOwner = await HomeOwners.findById(req.params.id).select(
    "-password"
  );
  if (!homeOwner) return res.status(404).send("Not Found");
  res.status(200).send(homeOwner);
});

//delete homeOwners account
router.delete("/:id", async (req, res) => {
  const homeOwner = await HomeOwners.findByIdAndDelete(req.params.id);
  if (!homeOwner) return res.status(404).send("Not Found");
  res.status(200).send(homeOwner);
});

//update homeOwners information
router.put("/:id", async (req, res) => {
  const homeOwner = await HomeOwners.findByIdAndUpdate(req.params.id, req.body);
  if (!homeOwner)
    return res.status(404).send("User with the given ID does not exist");
  res.send(homeOwner);
});

module.exports = router;
