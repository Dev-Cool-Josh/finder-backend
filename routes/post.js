const express = require("express");
const multer = require("multer");
const router = express.Router();

const { Post, validatePost } = require("../models/Post");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:|\./g, "") + " - " + file.originalname
    );
  },
});

const upload = multer({ storage: storage });

const mulitpleImage = upload.fields([
  { name: "roomImage", maxCount: 1 },
  { name: "permit", maxCount: 1 },
]);

router.post("/", mulitpleImage, async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const post = new Post({
    postOwner: req.body.name,
    price: req.body.price,
    contact: req.body.contact,
    gender: req.body.gender,
    address: req.body.address,
    vacancy: req.body.vancancy,
    roomImage: req.files.roomImage[0].path,
    permit: req.files.permit[0].path,
  });

  const data = await post.save();
  res.send(data);
});

module.exports = router;
