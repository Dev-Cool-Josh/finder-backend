const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();

const { validateAdmin, Admin } = require("../models/Admin");
const {
  Notification,
  validateNotification,
} = require("../models/Norification");

router.post("/", async (req, res) => {
  const { error } = validateAdmin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let admin = await Admin.findOne({ email: req.body.email });
  if (admin) return res.status(400).send("this user is already registerd");

  admin = new Admin(_.pick(req.body, ["email", "name", "password"]));
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);
  await admin.save();
  res.send(_.pick(admin, ["_id", "email", "name", "password"]));
});

router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    return res.send(admin);
  } catch (error) {
    res.send(error);
  }
});

//send notification
router.post("/send-notification", async (req, res) => {
  const { error } = validateNotification(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let notification = new Notification({
    sender: req.body.sender,
    receiver: req.body.receiver,
    message: req.body.message,
  });

  await notification.save();
  res.send(notification);
});

module.exports = router;
