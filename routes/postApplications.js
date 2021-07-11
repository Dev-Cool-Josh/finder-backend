const express = require("express");
const router = express.Router();

const multer = require("multer");

const { PostApplications } = require("../models/PostApplications");
const {
  Notification,
  validateNotification,
} = require("../models/Norification");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

//apply on a post
router.post("/", upload.single("userVitae"), async (req, res) => {
  const postApplication = new PostApplications({
    postId: req.body.postId,
    userId: req.body.userId,
    userImage: req.body.userImage,
    userName: req.body.userName,
    studentNumber: req.body.studentNumber,
    userVitae: req.file.path,
  });
  await postApplication.save();
  res.send(postApplication);
});

//get all applications for a given post
router.get("/:postId", async (req, res) => {
  const postApplication = await PostApplications.find({
    postId: req.params.postId,
  });
  if (!postApplication) return res.status(400).send("No Applications yet");
  return res.send(postApplication);
});

//reject or delete applications
router.delete("/:id", async (req, res) => {
  const postApplication = await PostApplications.findByIdAndDelete(
    req.params.id
  );
  if (!postApplication) return res.status(404).send("not found");
  return res.send(postApplication);
});

//accept post
router.patch("/:id", async (req, res) => {
  const postApplication = await PostApplications.findById(req.params.id);
  if (!postApplication) return res.status(404).send("not found");
  postApplication.isAccepted = true;

  await postApplication.save();
  return res.send(postApplication);
});

//send notifications
router.post("/send-notifications", async (req, res) => {
  const { error } = validateNotification(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const notification = new Notification({
    sender: req.body.sender,
    receiver: req.body.receiver,
    message: req.body.message,
  });

  await notification.save();
  return res.send(notification);
});
module.exports = router;
