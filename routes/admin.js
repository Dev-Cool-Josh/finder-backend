const express = require("express");
const _ = require("lodash");
const router = express.Router();

const { validateAdmin, Admin } = require("../models/Admin");

router.post("/", async (req, res) => {
  const { error } = validateAdmin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let admin = await Admin.findOne({ email: req.body.email });
  if (admin) return res.status(400).send("this user is already registerd");

  admin = new Admin(_.pick(req.body, ["email", "name", "password"]));
  await admin.save();
  res.status(200).send(_.pick(admin, ["_id", "email", "name", "password"]));
});

module.exports = router;
