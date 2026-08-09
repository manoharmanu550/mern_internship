
const express = require("express");
const router = express.Router();

const {
  saveBookmark,
  removeBookmark,
  getBookmarks,
} = require("../controllers/bookmarkController");

const { protect } = require("../middleware/authMiddleware");

// Save Bookmark
router.post("/", protect, saveBookmark);

// Remove Bookmark
router.delete("/:postId", protect, removeBookmark);

// Get My Bookmarks
router.get("/", protect, getBookmarks);

module.exports = router;