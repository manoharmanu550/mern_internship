const mongoose = require("mongoose");
const Bookmark = require("../models/Bookmark");
const Post = require("../models/Post");

// ========================================
// SAVE BOOKMARK
// ========================================
const saveBookmark = async (req, res) => {
  try {
    const { post } = req.body;

    // Validate post ID
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(post)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID",
      });
    }

    // Check whether post exists
    const postExists = await Post.findById(post);

    if (!postExists) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check duplicate bookmark
    const alreadySaved = await Bookmark.findOne({
      post: post,
      user: req.user._id,
    });

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Post already bookmarked",
        bookmark: alreadySaved,
      });
    }

    // Create bookmark
    const bookmark = await Bookmark.create({
      post: post,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Bookmark Saved Successfully",
      bookmark,
    });
  } catch (error) {
    console.error("SAVE BOOKMARK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// REMOVE BOOKMARK
// Supports:
// /id/:bookmarkId
// /post/:postId
// ========================================
const removeBookmark = async (req, res) => {
  try {
    const bookmarkId = req.params.bookmarkId;
    const postId = req.params.postId;

    console.log("========== REMOVE BOOKMARK ==========");
    console.log("Bookmark ID:", bookmarkId);
    console.log("Post ID:", postId);
    console.log("User ID:", req.user._id);

    // ========================================
    // CASE 1: Delete using BOOKMARK ID
    // ========================================
    if (bookmarkId) {
      if (!mongoose.Types.ObjectId.isValid(bookmarkId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Bookmark ID",
        });
      }

      const bookmark = await Bookmark.findOne({
        _id: bookmarkId,
        user: req.user._id,
      });

      if (!bookmark) {
        return res.status(404).json({
          success: false,
          message: "Bookmark not found",
        });
      }

      await Bookmark.findByIdAndDelete(bookmarkId);

      console.log("Bookmark deleted successfully");

      return res.status(200).json({
        success: true,
        message: "Bookmark Removed Successfully",
      });
    }

    // ========================================
    // CASE 2: Delete using POST ID
    // ========================================
    if (postId) {
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Post ID",
        });
      }

      const bookmark = await Bookmark.findOne({
        post: postId,
        user: req.user._id,
      });

      if (!bookmark) {
        return res.status(404).json({
          success: false,
          message: "Bookmark not found",
        });
      }

      await Bookmark.findByIdAndDelete(bookmark._id);

      console.log("Bookmark deleted successfully using Post ID");

      return res.status(200).json({
        success: true,
        message: "Bookmark Removed Successfully",
      });
    }

    // ========================================
    // No ID provided
    // ========================================
    return res.status(400).json({
      success: false,
      message: "Bookmark ID or Post ID is required",
    });
  } catch (error) {
    console.error("REMOVE BOOKMARK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET MY BOOKMARKS
// ========================================
const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user._id,
    })
      .populate({
        path: "post",
        populate: {
          path: "author",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bookmarks,
    });
  } catch (error) {
    console.error("GET BOOKMARKS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveBookmark,
  removeBookmark,
  getBookmarks,
};