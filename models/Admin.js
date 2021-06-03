const mongoose = require("mongoose");
const Joi = require("joi");

const admin = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
});

const Admin = mongoose.model("Admin", admin);

function validateAdmin(admin) {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(10),
  };
  return Joi.validate(admin, schema);
}

exports.Admin = Admin;
exports.validateAdmin = validateAdmin;
