const mongoose = require("mongoose");
const Joi = require("joi");
const postSchema = new mongoose.Schema({
  postOwner: String,
  postDate: { type: Date, default: Date.now },
  isBookmarked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  price: String,
  contact: String,
  gender: String,
  address: String,
  vacancy: Number,
  roomImage: { type: String, required: true },
  permit: { type: String, required: true },
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
