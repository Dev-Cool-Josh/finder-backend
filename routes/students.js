const express = require("express");
const multer = require("multer");
const router = express.Router();

const bcrypt = require("bcrypt");
const _ = require("lodash");

const { User, validateUser } = require("../models/User");
const { validateStudent, Student } = require("../models/Student");
const { Notification } = require("../models/Norification");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

//update image
router.patch("/:id", upload.single("avatar"), async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(400).send("this user does not exist");

  student.avatar = req.file.path;
  await student.save();
  return res.send(student);
});

router.patch("/information/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(400).send("invalid user id");
  student.email = req.body.email;
  student.contact = req.body.contact;
  await student.save();
  return res.send(student);
});

//student registration
router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    studentNumber: req.body.studentNumber,
    studentName: req.body.studentName,
  });

  if (user) {
    const { error } = validateStudent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let student = await Student.findOne({
      studentNumber: req.body.studentNumber,
    });

    if (student)
      return res.status(400).send("This Student is already registered");

    student = new Student(
      _.pick(req.body, ["studentNumber", "password", "studentName", "email"])
    );
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(student.password, salt);

    await student.save();
    res.send(
      _.pick(student, [
        "_id",
        "studentNumber",
        "studentName",
        "email",
        "password",
      ])
    );
  } else res.status(404).send("This student does not exist");
});

//get all the students
router.get("/", async (req, res) => {
  let student = await Student.find();
  if (!student)
    return res.status(404).send("There is no student registerd yet");
  return res.send(student);
});

//get the current student
router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id).select("-password");
  if (!student) return res.status(404).send("Not Found");
  res.status(200).send(student);
});

//update student info
router.put("/:id", async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body);
  if (!student) return res.status(404).send("Not Found");
  res.status(200).send(student);
});

//delete student
router.delete("/:id", async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).send("Not Found");
  res.status(200).send(student);
});

//add bookmark
router.patch("/add-bookmark/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send("not found");
  if (student.bookmarks.find((bookmark) => bookmark === req.body.postId))
    return res.status(400).send("already added");
  student.bookmarks.push(req.body.postId);
  await student.save();
  res.send(student);
});

//get notifications
router.get("/get-notifications/:id", async (req, res) => {
  const notification = await Notification.find({ receiver: req.params.id });
  if (!notification) return res.status(400).send("no notifications yet");
  return res.send(notification);
});

module.exports = router;
