const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
  postOwner: { type: String },
  postDate: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  price: { type: String },
  contact: { type: String },
  gender: { type: String },
  vacancy: { type: Number },
  roomImage: { type: String },
  permit: { type: String },
  address: {
    houseNumber: { type: String },
    street: { type: String },
    barangay: { type: String },
    city: { type: String },
  },
});

const Post = new mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = {
    postOwner: Joi.string().required().min(8),
    price: Joi.string().required(),
    contact: Joi.string().required(),
    gender: Joi.string().required(),
    vacancy: Joi.string().required(),
  };

  return Joi.validate(post, schema);
}

exports.Post = Post;
exports.validatePost = validatePost;
