const express = require("express");

const router =
  express.Router();


const {
  likePost,
  unlikePost,
  getMyLikes,
  getLikes,
} = require(
  "../controllers/likeController"
);


const {
  protect,
} = require(
  "../middleware/authMiddleware"
);


// =========================================================
// LIKE A POST
// =========================================================

router.post(
  "/",
  protect,
  likePost
);


// =========================================================
// GET MY LIKED POSTS
// IMPORTANT: This must come before /:postId
// =========================================================

router.get(
  "/mine/all",
  protect,
  getMyLikes
);


// =========================================================
// GET LIKE COUNT
// =========================================================

router.get(
  "/:postId",
  getLikes
);


// =========================================================
// UNLIKE POST
// =========================================================

router.delete(
  "/:postId",
  protect,
  unlikePost
);


module.exports =
  router;