const mongoose = require("mongoose");

const Like = require("../models/Like");
const Post = require("../models/Post");


// =========================================================
// LIKE POST
// POST /api/likes
// =========================================================

const likePost = async (req, res) => {
  try {

    const { post } = req.body;


    console.log(
      "========== LIKE POST =========="
    );

    console.log(
      "Post:",
      post
    );

    console.log(
      "User:",
      req.user?._id
    );


    // -----------------------------------------------------
    // LOGIN CHECK
    // -----------------------------------------------------

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }


    // -----------------------------------------------------
    // POST VALIDATION
    // -----------------------------------------------------

    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }


    if (
      !mongoose.Types.ObjectId.isValid(
        post
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID",
      });
    }


    // -----------------------------------------------------
    // CHECK POST
    // -----------------------------------------------------

    const postExists =
      await Post.findById(post);

    if (!postExists) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }


    // -----------------------------------------------------
    // CHECK EXISTING LIKE
    // -----------------------------------------------------

    const alreadyLiked =
      await Like.findOne({
        post,
        user: req.user._id,
      });


    if (alreadyLiked) {
      return res.status(400).json({
        success: false,
        message:
          "You already liked this post",
        like: alreadyLiked,
      });
    }


    // -----------------------------------------------------
    // CREATE LIKE
    // -----------------------------------------------------

    const like =
      await Like.create({
        post,
        user: req.user._id,
      });


    return res.status(201).json({
      success: true,
      message:
        "Post Liked Successfully",
      like,
    });


  } catch (error) {

    console.error(
      "LIKE POST ERROR:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to like post",
    });
  }
};


// =========================================================
// GET LIKE COUNT
// GET /api/likes/:postId
// =========================================================

const getLikes = async (req, res) => {
  try {

    const { postId } = req.params;


    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }


    if (
      !mongoose.Types.ObjectId.isValid(
        postId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID",
      });
    }


    const likes =
      await Like.countDocuments({
        post: postId,
      });


    return res.status(200).json({
      success: true,
      likes,
    });


  } catch (error) {

    console.error(
      "GET LIKES ERROR:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get likes",
    });
  }
};


// =========================================================
// GET MY LIKES
// GET /api/likes/mine/all
// =========================================================

const getMyLikes = async (req, res) => {
  try {

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }


    const likes =
      await Like.find({
        user: req.user._id,
      })
        .populate({
          path: "post",
          populate: {
            path: "author",
            select: "name email",
          },
        })
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({
      success: true,
      likes,
    });


  } catch (error) {

    console.error(
      "GET MY LIKES ERROR:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get liked posts",
    });
  }
};


// =========================================================
// UNLIKE POST
// DELETE /api/likes/:postId
// =========================================================

const unlikePost = async (req, res) => {
  try {

    const { postId } = req.params;


    console.log(
      "========== UNLIKE POST =========="
    );

    console.log(
      "Post ID:",
      postId
    );

    console.log(
      "User ID:",
      req.user?._id
    );


    // -----------------------------------------------------
    // LOGIN CHECK
    // -----------------------------------------------------

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }


    // -----------------------------------------------------
    // POST ID CHECK
    // -----------------------------------------------------

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }


    if (
      !mongoose.Types.ObjectId.isValid(
        postId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID",
      });
    }


    // -----------------------------------------------------
    // FIND LIKE
    // -----------------------------------------------------

    const like =
      await Like.findOne({
        post: postId,
        user: req.user._id,
      });


    console.log(
      "Matching Like:",
      like
    );


    if (!like) {

      return res.status(404).json({
        success: false,
        message:
          "Like Not Found for this user and post",
      });

    }


    // -----------------------------------------------------
    // DELETE LIKE
    // -----------------------------------------------------

    await Like.deleteOne({
      _id: like._id,
    });


    return res.status(200).json({
      success: true,
      message:
        "Post Unliked Successfully",
    });


  } catch (error) {

    console.error(
      "UNLIKE POST ERROR:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to unlike post",
    });
  }
};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  likePost,
  getLikes,
  getMyLikes,
  unlikePost,
};