const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const multer = require("multer");
const router = express.Router();

const { HomeOwners, validateHomeOwners } = require("../models/HomeOwners");
const { Notification } = require("../models/Norification");
const { Post } = require("../models/Post");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.patch("/:id", upload.single("avatar"), async (req, res) => {
  const homeOwner = await HomeOwners.findById(req.params.id);
  if (!homeOwner) return res.status(400).send("this user doesn't exist");
  homeOwner.avatar = req.file.path;
  await homeOwner.save();
  return res.send(homeOwner);
});

router.patch("/information/:id", async (req, res) => {
  const homeOwner = await HomeOwners.findById(req.params.id);
  if (!homeOwner) return res.status(400).send("Invalid Id");
  homeOwner.contact = req.body.contact;
  homeOwner.email = req.body.email;
  await homeOwner.save();
  return res.send(homeOwner);
});

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

router.get("/notification/:userName", async (req, res) => {
  const notifications = await Notification.find({
    receiver: req.params.userName,
  });
  if (!notifications) return res.status(404).send("No notifications yet");
  res.send(notifications);
});

//get posts request
router.get("/post-requests/:userName", async (req, res) => {
  const posts = await Post.find({ postOwner: req.params.userName });
  if (!posts) return res.status(400).send("No posts yet");
  return res.send(posts);
});

module.exports = router;
