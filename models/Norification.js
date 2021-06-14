const mongoose = require("mongoose");
const Joi = require("joi");

const Notification = mongoose.model(
  "Notification",
  new mongoose.Schema({
    sender: String,
    receiver: String,
    message: String,
  })
);

const validateNotification = (notification) => {
  const schema = {
    sender: Joi.string().required(),
    receiver: Joi.string().required(),
    message: Joi.string().required(),
  };
  return Joi.validate(notification, schema);
};

exports.Notification = Notification;
exports.validateNotification = validateNotification;
