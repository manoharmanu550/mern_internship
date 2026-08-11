import React, { useState } from "react";

import {
  useNavigate,
  useParams,
  Link
} from "react-router-dom";

import API from "../services/api";


function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();


  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    // ==================================================
    // TOKEN CHECK
    // ==================================================

    if (!token) {

      setError(
        "Reset token is missing"
      );

      return;
    }


    // ==================================================
    // PASSWORD CHECK
    // ==================================================

    if (password.length < 6) {

      setError(
        "Password must contain at least 6 characters"
      );

      return;
    }


    // ==================================================
    // CONFIRM PASSWORD
    // ==================================================

    if (password !== confirmPassword) {

      setError(
        "Passwords do not match"
      );

      return;
    }


    try {

      setLoading(true);


      // ==================================================
      // RESET PASSWORD API
      // ==================================================

      const response = await API.post(
        `/auth/reset-password/${token}`,
        {
          password: password
        }
      );


      // ==================================================
      // SUCCESS
      // ==================================================

      setMessage(
        response.data.message ||
        "Password reset successful."
      );


      // Clear fields
      setPassword("");
      setConfirmPassword("");


      // ==================================================
      // GO TO LOGIN
      // ==================================================

      setTimeout(() => {

        navigate("/login");

      }, 2000);


    } catch (err) {

      console.error(
        "Reset password error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Invalid or expired reset link"
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="auth-container">

      <div className="auth-card">

        <h2>
          Reset Password
        </h2>


        <p>
          Enter your new password below.
        </p>


        <form onSubmit={handleSubmit}>

          {/* NEW PASSWORD */}

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            minLength={6}
            required
          />


          {/* CONFIRM PASSWORD */}

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            minLength={6}
            required
          />


          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Resetting..."
              : "Reset Password"
            }

          </button>

        </form>


        {/* ==================================================
            SUCCESS
        ================================================== */}

        {message && (

          <p className="success-message">
            {message}
          </p>

        )}


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <p className="error-message">
            {error}
          </p>

        )}


        <div style={{ marginTop: "15px" }}>

          <Link to="/login">
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}


export default ResetPassword;