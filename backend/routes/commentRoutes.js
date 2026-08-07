const express = require("express");
const router = express.Router();

const {
  createComment,
  getCommentsByPost,
} = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware");

// Create Comment
router.post("/", protect, createComment);

// Get Comments By Post
router.get("/:postId", getCommentsByPost);

module.exports = router;