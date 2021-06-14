const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const SECRET_TOKEN = process.env.SECRET_TOKEN;

const studentSchema = new mongoose.Schema({
  bookmarks: [],
  studentNumber: String,
  studentName: String,
  password: String,
  email: { type: String, default: "sample@gmail.com" },
});

studentSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      studentName: this.studentName,
      email: this.email,
    },
    SECRET_TOKEN
  );
  return token;
};

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
