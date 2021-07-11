const mongoose = require("mongoose");

const PostApplications = mongoose.model(
  "PostApplications",
  new mongoose.Schema({
    postId: String,
    userId: String,
    userImage: String,
    userName: String,
    studentNumber: String,
    userVitae: String,
    isAccepted: { type: Boolean, default: false },
  })
);

exports.PostApplications = PostApplications;
