const express = require("express");
const router = express.Router();
const Stories = require("../models/Stories");
const fetchUser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

router.get("/fetchstories", fetchUser, async (req, res) => {
  try {
    const stories = await Stories.find({ user: req.user.id });
    res.send(stories);
  } catch (error) {
    res.status(500).send("Error while logging in user: " + error.message);
  }
});
router.post(
  "/poststory",
  fetchUser,
  [
    body("story", "Please generate a story first").exists(),
    body("url", "Couldn't store image").exists(),
  ],
  async (req, res) => {
    try {

      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, url, story } = req.body;
      const newStory = new Stories({
        title: title,
        url: url,
        story: story,
        user: req.user.id,
      });
      const savedStory = await newStory.save();
      res.json(savedStory);
    } catch (error) {
      res.status(500).send("Error while posting story " + error.message);
    }
  }
);
//editing title
//
router.put("/updatestorytitle/:id", fetchUser, async (req, res) => {
  try {
    const { title } = req.body;
    const story = await Stories.findById(req.params.id);

    if (!story) {
      return res.status(404).send("Requested Story not found");
    }

    if (story.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    story.title = title;
    await story.save();

    res.send("Story title updated Successfully");
  } catch (error) {
    res.status(500).send("Error while updating story title " + error.message);
  }
});

// Deleting Stories
router.delete("/deletestory/:id", fetchUser, async (req, res) => {
  try {
    let story = await Stories.findById(req.params.id);
    if (!story) return res.status(404).send("Requested Story not found");

    if (story.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    story = await Stories.findByIdAndDelete(req.params.id);
    res.send("Story deleted Successfully");
  } catch (error) {
    res.status(500).send("Error while deleting story " + error.message);
  }
});
module.exports = router;
