const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    // ==================================================
    // COMMENT TEXT
    // ==================================================

    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      minlength: [1, "Comment cannot be empty"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },

    // ==================================================
    // COMMENT AUTHOR
    // ==================================================

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Comment author is required"],
    },

    // ==================================================
    // POST
    // ==================================================

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required"],
    },
  },

  {
    timestamps: true,
  }
);


// ======================================================
// EXPORT MODEL
// ======================================================

module.exports = mongoose.model(
  "Comment",
  commentSchema
);