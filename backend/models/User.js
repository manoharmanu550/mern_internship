const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==================================================
    // USER NAME
    // ==================================================

    name: {
      type: String,
      required: true,
      trim: true
    },


    // ==================================================
    // EMAIL
    // ==================================================

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },


    // ==================================================
    // PASSWORD
    // ==================================================

    password: {
      type: String,
      required: true
    },


    // ==================================================
    // BIO
    // ==================================================

    bio: {
      type: String,
      maxlength: 200,
      default: ""
    },


    // ==================================================
    // AVATAR
    // ==================================================

    avatarUrl: {
      type: String,
      default: ""
    },


    // ==================================================
    // RECOVERY PIN
    // Used for simple password recovery
    // ==================================================

    recoveryPin: {
      type: String,
      default: null
    },


    // ==================================================
    // OLD RESET TOKEN FIELDS
    // Kept so existing functionality/data is not affected
    // ==================================================

    resetPasswordToken: {
      type: String,
      default: null
    },

    resetPasswordExpire: {
      type: Date,
      default: null
    }
  },


  // ====================================================
  // TIMESTAMPS
  // ====================================================

  {
    timestamps: true
  }
);


// ======================================================
// EXPORT USER MODEL
// ======================================================

module.exports = mongoose.model(
  "User",
  userSchema
);