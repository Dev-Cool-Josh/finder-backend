const mongoose = require("mongoose");
const Joi = require("joi");

const homeOwnersSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
});

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
