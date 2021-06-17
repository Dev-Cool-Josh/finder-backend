const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const SECRET_TOKEN = process.env.SECRET_TOKEN;

const homeOwnersSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  avatar: String,
  contact: String,
});

homeOwnersSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, email: this.email },
    SECRET_TOKEN
  );
  return token;
};

const HomeOwners = mongoose.model("HomeOwners", homeOwnersSchema);

function validateHomeOwners(homeOwner) {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(10),
  };
  return Joi.validate(homeOwner, schema);
}

exports.HomeOwners = HomeOwners;
exports.validateHomeOwners = validateHomeOwners;
