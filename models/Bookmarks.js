const mongoose = require("mongoose");
const Joi = require("joi");

const bookmarkSchema = new mongoose.Schema({
  _id: String,
  postId: String,
  postOwner: { type: String },
  postDate: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  price: { type: String },
  contact: { type: String },
  gender: { type: String },
  vacancy: { type: Number },
  roomImage: { type: String },
  address: {
    houseNumber: { type: String },
    street: { type: String },
    barangay: { type: String },
    city: { type: String },
  },
});

const Bookmarks = mongoose.model("Bookmarks", bookmarkSchema);

function validateBookmarks(req) {
  const schema = {
    postOwner: Joi.string().required().min(8),
    price: Joi.string().required(),
    contact: Joi.string().required(),
    gender: Joi.string().required(),
    vacancy: Joi.number().required(),
    roomImage: Joi.string().required(),
    isVerified: Joi.boolean().required(),
  };
  return Joi.validate(req, schema);
}

exports.bookmarkSchema = bookmarkSchema;
exports.Bookmarks = Bookmarks;
exports.validate = validateBookmarks;
