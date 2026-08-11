const express = require("express");

const router = express.Router();

const {
  likePost,
  unlikePost,
  getMyLikes,
  getLikes,
} = require("../controllers/likeController");

const {
  protect,
} = require("../middleware/authMiddleware");


// =========================================================
// LIKE POST
// POST /api/likes
// =========================================================

router.post(
  "/",
  protect,
  likePost
);


// =========================================================
// GET MY LIKED POSTS
// GET /api/likes/mine/all
// =========================================================

router.get(
  "/mine/all",
  protect,
  getMyLikes
);


// =========================================================
// GET LIKE COUNT
// GET /api/likes/:postId
// =========================================================

router.get(
  "/:postId",
  getLikes
);


// =========================================================
// UNLIKE POST
// DELETE /api/likes/:postId
// =========================================================

router.delete(
  "/:postId",
  protect,
  unlikePost
);


module.exports = router;