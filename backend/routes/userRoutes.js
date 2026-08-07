const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// Get Profile
router.get("/me", protect, getMyProfile);

// Update Profile
router.put("/me", protect, updateMyProfile);

module.exports = router;