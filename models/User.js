const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  studentNumber: String,
  studentName: String,
  password: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    studentNumber: Joi.string().required().max(8),
    studentName: Joi.string().required().min(10),
    password: Joi.string(),
    email: Joi.string().email(),
  };
  return Joi.validate(user, schema);
}
exports.User = User;
exports.validateUser = validateUser;
