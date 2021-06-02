const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const _ = require("lodash");

const { User, validateUser } = require("../models/User");
const { validateStudent, Student } = require("../models/Student");
const { json } = require("body-parser");

//student registration
router.post("/", async (req, res) => {
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
  }

  res.status(400).send("This student does not exist");
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

module.exports = router;
