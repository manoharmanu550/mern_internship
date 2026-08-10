const express = require("express");
const router = express.Router();

const {
  saveBookmark,
  removeBookmark,
  getBookmarks,
} = require("../controllers/bookmarkController");

const { protect } = require("../middleware/authMiddleware");

// ========================================
// SAVE BOOKMARK
// POST /api/bookmarks
// ========================================
router.post("/", protect, saveBookmark);

// ========================================
// REMOVE BOOKMARK BY BOOKMARK ID
// DELETE /api/bookmarks/id/:bookmarkId
// ========================================
router.delete("/id/:bookmarkId", protect, removeBookmark);

// ========================================
// REMOVE BOOKMARK BY POST ID
// DELETE /api/bookmarks/post/:postId
// ========================================
router.delete("/post/:postId", protect, removeBookmark);

// ========================================
// GET MY BOOKMARKS
// GET /api/bookmarks
// ========================================
router.get("/", protect, getBookmarks);

module.exports = router;