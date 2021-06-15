const express = require("express");
const multer = require("multer");
const router = express.Router();

const { Post, validatePost } = require("../models/Post");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const mulitpleImage = upload.fields([
  { name: "roomImage", maxCount: 1 },
  { name: "permit", maxCount: 1 },
]);

router.post(
  "/:houseNumber/:street/:barangay/:city",
  mulitpleImage,
  async (req, res) => {
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const post = new Post({
      postOwner: req.body.postOwner,
      price: req.body.price,
      contact: req.body.contact,
      gender: req.body.gender,
      vacancy: req.body.vacancy,
      roomImage: req.files.roomImage[0].path,
      permit: req.files.permit[0].path,
      address: {
        houseNumber: req.params.houseNumber,
        street: req.params.street,
        barangay: req.params.barangay,
        city: req.params.city,
      },
    });

    const data = await post.save();
    res.send(data);
  }
);

//get all the post
router.get("/", async (req, res) => {
  const posts = await Post.find();
  if (!posts) return res.status(404).send("There is currently no post!");
  return res.send(posts);
});

//get all the post by gender
router.get("/gender/:gender", async (req, res) => {
  const posts = await Post.find({ gender: req.params.gender });
  if (!posts)
    return res.status(404).send("There is no post with this gender yet");
  return res.send(posts);
});

//get all of the verified user
router.get("/verified", async (req, res) => {
  const verifiedPosts = await Post.find({ isVerified: true });
  if (!verifiedPosts) return res.status(400).send("No Verified Posts yet");
  res.send(verifiedPosts);
});

//get all unverified posts
router.get("/unverified-posts", async (req, res) => {
  const unVerifiedPosts = await Post.find({ isVerified: false });
  if (!unVerifiedPosts) return res.status(400).send("No posts yet");
  res.send(unVerifiedPosts);
});

//delete post
router.delete("/:id", async (req, res) => {
  const post = await Post.findByIdAndDelete({ _id: req.params.id });
  if (!post) return res.status(404).send("This post does not exist");
  return res.send(post);
});

//verify post
router.patch("/verify/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Not found");
  post.isVerified = true;
  await post.save();
  res.send(post);
});

router.patch("/mark-as-full/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(400).send("invalid id");
  post.isFull = true;
  await post.save();
  return res.send(post);
});

module.exports = router;
