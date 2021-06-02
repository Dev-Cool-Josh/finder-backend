const mongoose = require("mongoose");
const Joi = require("joi");

const studentSchema = new mongoose.Schema({
  studentNumber: String,
  studentName: String,
  password: String,
  email: { type: String, default: "sample@gmail.com" },
});

const Student = mongoose.model("Student", studentSchema);

function validateStudent(student) {
  const schema = {
    email: Joi.string().email().required(),
    studentNumber: Joi.string().required().max(8),
    password: Joi.string().required().min(8),
    studentName: Joi.string().required().min(10),
    email: Joi.string().email(),
  };
  return Joi.validate(student, schema);
}

exports.Student = Student;
exports.validateStudent = validateStudent;
