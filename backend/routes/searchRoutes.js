const express = require("express");
const router = express.Router();

const {
  searchPosts,
} = require("../controllers/searchController");

// Search Posts
router.get("/", searchPosts);

module.exports = router;