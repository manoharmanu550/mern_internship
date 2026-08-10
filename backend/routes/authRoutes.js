const express = require("express");

const {
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

const router = express.Router();

// ==========================================
// FORGOT PASSWORD
// ==========================================

router.post("/forgot-password", forgotPassword);

// ==========================================
// RESET PASSWORD
// ==========================================

router.post("/reset-password/:token", resetPassword);

// ==========================================
// EXPORT
// ==========================================

module.exports = router;