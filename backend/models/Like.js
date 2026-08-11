const mongoose = require("mongoose");


// =========================================================
// LIKE SCHEMA
// =========================================================

const likeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);


// =========================================================
// PREVENT DUPLICATE LIKES
// =========================================================

likeSchema.index(
  {
    post: 1,
    user: 1,
  },
  {
    unique: true,
  }
);


// =========================================================
// MODEL
// =========================================================

module.exports =
  mongoose.model(
    "Like",
    likeSchema
  );