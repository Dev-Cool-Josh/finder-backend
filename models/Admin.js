const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const SECRET_TOKEN = process.env.SECRET_TOKEN;

const admin = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  contact: String,
});

admin.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, email: this.email },
    SECRET_TOKEN
  );
  return token;
};
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
