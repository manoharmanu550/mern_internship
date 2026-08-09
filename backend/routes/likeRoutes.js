const express = require("express");
const router = express.Router();

const {
  likePost,
  unlikePost,
  getLikeCount,
  getMyLikes,
  getLikes,
} = require("../controllers/likeController");

const { protect } = require("../middleware/authMiddleware");

// Like a Post
router.post("/", protect, likePost);

// Get My Liked Posts
router.get("/mine/all", protect, getMyLikes);

// Get Like Count of a Post
router.get("/:postId", getLikes);

// Unlike a Post
router.delete("/:postId", protect, unlikePost);

module.exports = router;