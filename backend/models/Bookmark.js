const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

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

bookmarkSchema.index(
  { user: 1, post: 1 },
  { unique: true }
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);