const express = require("express");
const router = express.Router();

const { Bookmarks, validate } = require("../models/Bookmarks");

router.post(
  "/:id/:postId/:houseNumber/:street/:barangay/:city",
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let bookmark = await Bookmarks.findById(req.params.id);
    if (bookmark) return res.status(400).send("already bookmarked");
    bookmark = new Bookmarks({
      _id: req.params.id,
      isVerified: req.body.isVerified,
      postId: req.params.postId,
      postDate: req.params.postDate,
      postOwner: req.body.postOwner,
      price: req.body.price,
      contact: req.body.contact,
      gender: req.body.gender,
      vacancy: req.body.vacancy,
      roomImage: req.body.roomImage,
      address: {
        houseNumber: req.params.houseNumber,
        street: req.params.street,
        barangay: req.params.barangay,
        city: req.params.city,
      },
    });
    await bookmark.save();
    return res.send(bookmark);
  }
);

module.exports = router;
