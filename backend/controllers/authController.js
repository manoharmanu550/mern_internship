const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// ======================================================
// GMAIL SMTP CONFIGURATION
// ======================================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },

  // Force IPv4
  family: 4,

  // Use STARTTLS
  requireTLS: true,

  // Prevent request from hanging forever
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000
});


// ======================================================
// REGISTER
// ======================================================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters"
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: cleanEmail
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: cleanEmail
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured"
      });
    }

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
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};


// ======================================================
// FORGOT PASSWORD
// Uses Gmail SMTP
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

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: cleanEmail
    });

    // Don't reveal whether email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If this email is registered, a password reset link has been sent."
      });
    }

    // Check Gmail credentials
    if (!process.env.EMAIL_USER) {
      return res.status(500).json({
        success: false,
        message: "EMAIL_USER is not configured"
      });
    }

    if (!process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: "EMAIL_PASS is not configured"
      });
    }

    // Check frontend URL
    if (!process.env.FRONTEND_URL) {
      return res.status(500).json({
        success: false,
        message: "FRONTEND_URL is not configured"
      });
    }


    // ==================================================
    // GENERATE RESET TOKEN
    // ==================================================

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    // Hash token before storing
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires after 15 minutes
    user.resetPasswordExpire = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();


    // ==================================================
    // RESET URL
    // ==================================================

    const frontendURL =
      process.env.FRONTEND_URL.replace(/\/$/, "");

    const resetURL =
      `${frontendURL}/reset-password/${resetToken}`;


    // ==================================================
    // GMAIL EMAIL
    // ==================================================

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

          <p
            style="
              font-size:12px;
              color:#777;
            "
          >
            MERN Internship
          </p>

        </div>
      `
    };


    // ==================================================
    // SEND EMAIL
    // ==================================================

    try {

      const info = await transporter.sendMail(
        mailOptions
      );

      console.log(
        "Password reset email sent to:",
        user.email
      );

      console.log(
        "Message ID:",
        info.messageId
      );

    } catch (emailError) {

      // Remove token if email failed
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;

      await user.save();

      console.error(
        "GMAIL SMTP ERROR:",
        emailError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to send password reset email"
      });
    }


    // ==================================================
    // SUCCESS RESPONSE
    // ==================================================

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
        error.message ||
        "Unable to send password reset email"
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


    // ==================================================
    // HASH RESET TOKEN
    // ==================================================

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");


    // ==================================================
    // FIND USER WITH VALID TOKEN
    // ==================================================

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


    // ==================================================
    // HASH NEW PASSWORD
    // ==================================================

    user.password = await bcrypt.hash(
      password,
      10
    );


    // ==================================================
    // REMOVE RESET TOKEN
    // ==================================================

    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();


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
        error.message ||
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