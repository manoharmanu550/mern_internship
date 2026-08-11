const mongoose = require("mongoose");

const Comment = require("../models/Comment");
const Post = require("../models/Post");


// =========================================================
// ADD COMMENT
// POST /api/comments
// =========================================================

const addComment = async (req, res) => {
  try {
    const {
      postId,
      post,
      text,
    } = req.body;

    console.log("=================================");
    console.log("          ADD COMMENT");
    console.log("=================================");
    console.log("Body:", req.body);
    console.log("Post ID:", postId);
    console.log("Post:", post);
    console.log("Text:", text);
    console.log("User:", req.user?._id);
    console.log("=================================");


    // -----------------------------------------------------
    // CHECK LOGIN
    // -----------------------------------------------------

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }


    // -----------------------------------------------------
    // SUPPORT BOTH postId AND post
    // -----------------------------------------------------

    const finalPostId = postId || post;


    if (!finalPostId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }


    // -----------------------------------------------------
    // VALIDATE POST ID
    // -----------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        finalPostId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID",
      });
    }


    // -----------------------------------------------------
    // VALIDATE COMMENT TEXT
    // -----------------------------------------------------

    if (
      typeof text !== "string" ||
      !text.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }


    const cleanText = text.trim();


    if (cleanText.length > 1000) {
      return res.status(400).json({
        success: false,
        message:
          "Comment cannot exceed 1000 characters",
      });
    }


    // -----------------------------------------------------
    // CHECK POST EXISTS
    // -----------------------------------------------------

    const postExists =
      await Post.findById(finalPostId);

    if (!postExists) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }


    // -----------------------------------------------------
    // CREATE COMMENT
    // -----------------------------------------------------

    const comment =
      await Comment.create({
        post: finalPostId,
        author: req.user._id,
        text: cleanText,
      });


    // -----------------------------------------------------
    // POPULATE AUTHOR
    // -----------------------------------------------------

    await comment.populate(
      "author",
      "name email"
    );


    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Comment Added Successfully",
      comment,
    });


  } catch (error) {

    console.error(
      "========== ADD COMMENT ERROR =========="
    );

    console.error(error);

    console.error(
      "======================================="
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to add comment",
    });
  }
};


// =========================================================
// GET COMMENTS
// GET /api/comments/:postId
// =========================================================

const getComments = async (req, res) => {
  try {

    const { postId } = req.params;


    console.log(
      "========== GET COMMENTS =========="
    );

    console.log(
      "Post ID:",
      postId
    );


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
    // CHECK POST
    // -----------------------------------------------------

    const post =
      await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }


    // -----------------------------------------------------
    // GET COMMENTS
    // -----------------------------------------------------

    const comments =
      await Comment.find({
        post: postId,
      })
        .populate(
          "author",
          "name email"
        )
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      count: comments.length,
      comments,
    });


  } catch (error) {

    console.error(
      "Get Comments Error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to load comments",
    });
  }
};


// =========================================================
// DELETE COMMENT
// DELETE /api/comments/:commentId
// =========================================================

const deleteComment = async (req, res) => {
  try {

    const { commentId } = req.params;


    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }


    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "Comment ID is required",
      });
    }


    if (
      !mongoose.Types.ObjectId.isValid(
        commentId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Comment ID",
      });
    }


    const comment =
      await Comment.findById(
        commentId
      );


    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }


    // -----------------------------------------------------
    // OWNER CHECK
    // -----------------------------------------------------

    if (
      comment.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete this comment",
      });
    }


    await comment.deleteOne();


    return res.status(200).json({
      success: true,
      message:
        "Comment Deleted Successfully",
    });


  } catch (error) {

    console.error(
      "Delete Comment Error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete comment",
    });
  }
};


// =========================================================
// EXPORT
// =========================================================

module.exports = {
  addComment,
  getComments,
  deleteComment,
};