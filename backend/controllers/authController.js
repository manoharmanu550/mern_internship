const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ======================================================
// FORGOT PASSWORD
// ======================================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    // Don't reveal whether email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If this email is registered, a password reset link has been sent."
      });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires after 15 minutes
    user.resetPasswordExpire = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    // Frontend URL
    const frontendURL = process.env.FRONTEND_URL;

    if (!frontendURL) {
      return res.status(500).json({
        success: false,
        message: "FRONTEND_URL is not configured"
      });
    }

    const resetURL =
      `${frontendURL}/reset-password/${resetToken}`;

    // Check email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: "Email configuration is missing"
      });
    }

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email
    const mailOptions = {
      from: `"MERN Internship" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 10px;
          "
        >

          <h2 style="color:#2563eb;">
            Password Reset
          </h2>

          <p>
            Hello ${user.name || "User"},
          </p>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <div style="margin:25px 0;">

            <a
              href="${resetURL}"
              style="
                display:inline-block;
                padding:12px 22px;
                background:#2563eb;
                color:#ffffff;
                text-decoration:none;
                border-radius:6px;
                font-weight:bold;
              "
            >
              Reset Password
            </a>

          </div>

          <p>
            This password reset link will expire in
            <strong>15 minutes</strong>.
          </p>

          <p>
            If you did not request this password reset,
            you can safely ignore this email.
          </p>

          <hr />

          <p style="font-size:12px;color:#777;">
            MERN Internship
          </p>

        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    console.log(
      "Password reset email sent to:",
      user.email
    );

    return res.status(200).json({
      success: true,
      message:
        "If this email is registered, a password reset link has been sent."
    });

  } catch (error) {

    console.error(
      "FORGOT PASSWORD ERROR:",
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
// RESET PASSWORD
// ======================================================

const resetPassword = async (req, res) => {
  try {

    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is missing"
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter a new password"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters"
      });
    }

    // Hash token received from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
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

    // Hash new password
    user.password = await bcrypt.hash(
      password,
      10
    );

    // Remove reset token
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    console.log(
      "Password reset successful for:",
      user.email
    );

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
  forgotPassword,
  resetPassword
};