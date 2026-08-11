const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ======================================================
// REGISTER
// ======================================================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters"
      });
    }

    // Clean email
    const cleanEmail = email.toLowerCase().trim();

    // Check existing user
    const existingUser = await User.findOne({
      email: cleanEmail
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // ==================================================
    // HASH PASSWORD
    // ==================================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // ==================================================
    // GENERATE 6-DIGIT RECOVERY PIN
    // ==================================================

    const recoveryPin =
      crypto.randomInt(100000, 1000000).toString();

    // ==================================================
    // CREATE USER
    // ==================================================

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      recoveryPin: recoveryPin
    });

    // ==================================================
    // REGISTRATION RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,
      message: "Registration successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },

      // IMPORTANT:
      // User should save this PIN for password recovery.
      recoveryPin: recoveryPin
    });

  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
};


// ======================================================
// LOGIN
// ======================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required"
      });
    }

    // Clean email
    const cleanEmail =
      email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: cleanEmail
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }

    // Compare password
    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          "JWT_SECRET is not configured"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }
    );

    // Response
    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl
      }
    });

  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};


// ======================================================
// FORGOT PASSWORD
// Email + Recovery PIN
// NO EMAIL SERVICE REQUIRED
// ======================================================

const forgotPassword = async (req, res) => {
  try {

    const {
      email,
      recoveryPin
    } = req.body;

    // ==================================================
    // VALIDATE EMAIL
    // ==================================================

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter your email"
      });
    }

    // ==================================================
    // VALIDATE RECOVERY PIN
    // ==================================================

    if (!recoveryPin) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter your recovery PIN"
      });
    }

    // ==================================================
    // CLEAN EMAIL
    // ==================================================

    const cleanEmail =
      email.toLowerCase().trim();

    // ==================================================
    // FIND USER
    // ==================================================

    const user = await User.findOne({
      email: cleanEmail
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "No account found with this email"
      });
    }

    // ==================================================
    // CHECK RECOVERY PIN
    // ==================================================

    if (
      !user.recoveryPin ||
      user.recoveryPin !==
        recoveryPin.toString().trim()
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or recovery PIN"
      });
    }

    // ==================================================
    // GENERATE RESET TOKEN
    // ==================================================

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    // ==================================================
    // HASH TOKEN
    // ==================================================

    user.resetPasswordToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // ==================================================
    // TOKEN EXPIRY
    // 15 MINUTES
    // ==================================================

    user.resetPasswordExpire =
      new Date(
        Date.now() +
        15 * 60 * 1000
      );

    await user.save();

    // ==================================================
    // CREATE RESET URL
    // ==================================================

    let resetURL;

    if (process.env.FRONTEND_URL) {

      const frontendURL =
        process.env.FRONTEND_URL
          .replace(/\/$/, "");

      resetURL =
        `${frontendURL}/reset-password/${resetToken}`;

    } else {

      resetURL =
        `/reset-password/${resetToken}`;
    }

    // ==================================================
    // LOG
    // ==================================================

    console.log(
      "PASSWORD RESET REQUEST:"
    );

    console.log(
      "User:",
      user.email
    );

    console.log(
      "Reset URL:",
      resetURL
    );

    // ==================================================
    // SUCCESS
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Recovery PIN verified. Reset your password.",

      resetURL: resetURL
    });

  } catch (error) {

    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to process password reset"
    });
  }
};


// ======================================================
// RESET PASSWORD
// ======================================================

const resetPassword = async (req, res) => {
  try {

    const {
      token
    } = req.params;

    const {
      password
    } = req.body;

    // ==================================================
    // TOKEN VALIDATION
    // ==================================================

    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Reset token is missing"
      });
    }

    // ==================================================
    // PASSWORD VALIDATION
    // ==================================================

    if (!password) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a new password"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters"
      });
    }

    // ==================================================
    // HASH TOKEN
    // ==================================================

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // ==================================================
    // FIND USER
    // ==================================================

    const user = await User.findOne({

      resetPasswordToken:
        hashedToken,

      resetPasswordExpire: {
        $gt: new Date()
      }

    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Reset link is invalid or has expired"
      });
    }

    // ==================================================
    // HASH NEW PASSWORD
    // ==================================================

    user.password =
      await bcrypt.hash(
        password,
        10
      );

    // ==================================================
    // REMOVE RESET TOKEN
    // ==================================================

    user.resetPasswordToken = null;

    user.resetPasswordExpire = null;

    await user.save();

    // ==================================================
    // LOG
    // ==================================================

    console.log(
      "Password reset successful for:",
      user.email
    );

    // ==================================================
    // SUCCESS
    // ==================================================

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now login."
    });

  } catch (error) {

    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong. Please try again."
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
};