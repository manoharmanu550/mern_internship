const express = require("express");
const router = express.Router();

const {
  createPost,
  getPosts,
  getMyPosts,
  searchPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");

// Create Post
router.post("/", protect, createPost);

// Get My Posts
router.get("/mine", protect, getMyPosts);

// Search Posts
router.get("/search", searchPosts);

// Get All Posts
router.get("/", getPosts);

// Get Single Post
router.get("/:id", getPostById);

// Update Post (Owner Only)
router.put("/:id", protect, updatePost);

// Delete Post (Owner Only)
router.delete("/:id", protect, deletePost);

module.exports = router;