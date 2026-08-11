const Comment = require("../models/Comment");

// ======================================================
// CREATE COMMENT
// ======================================================

const createComment = async (req, res) => {
  try {
    // Frontend nundi text and post vastayi
    const { text, post } = req.body;

    // Validate comment text
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    // Validate post ID
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    // Check logged-in user
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    // Create comment
    const comment = await Comment.create({
      text: text.trim(),
      post: post,
      author: req.user._id,
    });

    // Populate author details
    await comment.populate("author", "name email");

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment,
    });

  } catch (error) {
    console.error("CREATE COMMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create comment",
    });
  }
};


// ======================================================
// GET COMMENTS BY POST
// ======================================================

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    const comments = await Comment.find({
      post: postId,
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments,
    });

  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch comments",
    });
  }
};


// ======================================================
// DELETE COMMENT
// ======================================================

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Comment ID is required",
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Only comment owner can delete
    if (
      !req.user ||
      comment.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment",
      });
    }

    await Comment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });

  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete comment",
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createComment,
  getCommentsByPost,
  deleteComment,
};