const mongoose = require("mongoose");
const Like = require("../models/Like");
const Post = require("../models/Post");


// =========================================================
// LIKE POST
// =========================================================

const likePost = async (req, res) => {
  try {
    // Accept both post and postId
    const postId =
      req.body.postId ||
      req.body.post;

    console.log("=================================");
    console.log("LIKE POST");
    console.log("Post ID:", postId);
    console.log("User ID:", req.user?._id);
    console.log("=================================");


    // -------------------------------------------------------
    // Validate Post ID
    // -------------------------------------------------------

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }


    // -------------------------------------------------------
    // Validate ObjectId
    // -------------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID",
      });
    }


    // -------------------------------------------------------
    // Check User
    // -------------------------------------------------------

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }


    // -------------------------------------------------------
    // Check Post Exists
    // -------------------------------------------------------

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }


    // -------------------------------------------------------
    // Check Existing Like
    // -------------------------------------------------------

    const existingLike = await Like.findOne({
      post: postId,
      user: req.user._id,
    });


    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: "You already liked this post",
        liked: true,
        like: existingLike,
      });
    }


    // -------------------------------------------------------
    // Create Like
    // -------------------------------------------------------

    const like = await Like.create({
      post: postId,
      user: req.user._id,
    });


    console.log(
      "Like Created:",
      like._id
    );


    res.status(201).json({
      success: true,
      message: "Post Liked Successfully",
      liked: true,
      like,
    });


  } catch (error) {

    console.error(
      "Like Post Error:",
      error
    );


    // Duplicate key protection
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already liked this post",
        liked: true,
      });
    }


    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================================
// GET LIKE COUNT
// =========================================================

const getLikes = async (req, res) => {
  try {

    const { postId } = req.params;


    console.log(
      "GET LIKE COUNT:",
      postId
    );


    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }


    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID",
      });
    }


    const likes =
      await Like.countDocuments({
        post: postId,
      });


    res.status(200).json({
      success: true,
      likes,
      count: likes,
    });


  } catch (error) {

    console.error(
      "Get Likes Error:",
      error
    );


    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================================
// GET MY LIKED POSTS
// =========================================================

const getMyLikes = async (req, res) => {
  try {

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
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


    // Remove likes whose post no longer exists
    const validLikes =
      likes.filter(
        (like) => like.post
      );


    res.status(200).json({
      success: true,
      likes: validLikes,
    });


  } catch (error) {

    console.error(
      "Get My Likes Error:",
      error
    );


    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================================
// UNLIKE POST
// =========================================================

const unlikePost = async (req, res) => {
  try {

    const { postId } =
      req.params;


    console.log(
      "================================="
    );

    console.log(
      "UNLIKE POST"
    );

    console.log(
      "Post ID:",
      postId
    );

    console.log(
      "User ID:",
      req.user?._id
    );

    console.log(
      "================================="
    );


    // -------------------------------------------------------
    // Validate Post ID
    // -------------------------------------------------------

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


    // -------------------------------------------------------
    // Validate User
    // -------------------------------------------------------

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }


    // -------------------------------------------------------
    // Find Like
    // -------------------------------------------------------

    const matchingLike =
      await Like.findOne({
        post: postId,
        user: req.user._id,
      });


    console.log(
      "Matching Like:",
      matchingLike
    );


    // -------------------------------------------------------
    // Like Not Found
    // -------------------------------------------------------

    if (!matchingLike) {

      return res.status(404).json({
        success: false,
        message: "Like Not Found for this user and post",
        liked: false,
      });
    }


    // -------------------------------------------------------
    // Delete Like
    // -------------------------------------------------------

    await Like.deleteOne({
      _id: matchingLike._id,
    });


    console.log(
      "Like Deleted:",
      matchingLike._id
    );


    res.status(200).json({
      success: true,
      message: "Post Unliked Successfully",
      liked: false,
    });


  } catch (error) {

    console.error(
      "Unlike Post Error:",
      error
    );


    res.status(500).json({
      success: false,
      message: error.message,
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