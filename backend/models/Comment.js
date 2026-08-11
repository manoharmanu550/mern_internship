const mongoose = require("mongoose");


// =========================================================
// COMMENT SCHEMA
// =========================================================

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);


// =========================================================
// INDEX
// =========================================================

commentSchema.index({
  post: 1,
  createdAt: -1,
});


// =========================================================
// MODEL
// =========================================================

module.exports =
  mongoose.model(
    "Comment",
    commentSchema
  );