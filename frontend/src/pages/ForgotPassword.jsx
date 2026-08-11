import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const [recoveryPin, setRecoveryPin] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [resetURL, setResetURL] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ======================================================
  // HANDLE SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");
    setResetURL("");


    // ==================================================
    // VALIDATE EMAIL
    // ==================================================

    if (!email.trim()) {

      setError(
        "Please enter your email"
      );

      return;
    }


    // ==================================================
    // VALIDATE RECOVERY PIN
    // ==================================================

    if (!recoveryPin.trim()) {

      setError(
        "Please enter your recovery PIN"
      );

      return;
    }


    // ==================================================
    // VALIDATE PIN FORMAT
    // ==================================================

    if (
      !/^\d{6}$/.test(
        recoveryPin.trim()
      )
    ) {

      setError(
        "Recovery PIN must contain exactly 6 digits"
      );

      return;
    }


    try {

      setLoading(true);


      // ==================================================
      // REQUEST PASSWORD RESET
      // ==================================================

      const response = await API.post(
        "/auth/forgot-password",
        {
          email:
            email.trim(),

          recoveryPin:
            recoveryPin.trim()
        }
      );


      // ==================================================
      // SUCCESS MESSAGE
      // ==================================================

      setMessage(
        response.data.message ||
        "Recovery PIN verified successfully."
      );


      // ==================================================
      // GET RESET URL
      // ==================================================

      if (response.data.resetURL) {

        setResetURL(
          response.data.resetURL
        );
      }


    } catch (err) {

      console.error(
        "Forgot password error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h2>
          Forgot Password?
        </h2>


        <p>
          Enter your registered email and
          recovery PIN to reset your password.
        </p>


        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            required
          />


          {/* RECOVERY PIN */}

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit Recovery PIN"
            value={recoveryPin}
            onChange={(e) =>
              setRecoveryPin(
                e.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
            required
          />


          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Verifying..."
              : "Verify & Reset Password"
            }

          </button>

        </form>


        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {message && (

          <p
            className="success-message"
          >
            {message}
          </p>

        )}


        {/* ==================================================
            RESET PASSWORD LINK
        ================================================== */}

        {resetURL && (

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              textAlign: "center"
            }}
          >

            <p>
              <strong>
                Recovery PIN verified!
              </strong>
            </p>

            <p>
              Click below to create your
              new password.
            </p>


            <Link
              to={resetURL}
              style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "10px 15px",
                background: "#2563eb",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px"
              }}
            >
              Reset Password
            </Link>

          </div>

        )}


        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (

          <p
            className="error-message"
          >
            {error}
          </p>

        )}


        {/* ==================================================
            BACK TO LOGIN
        ================================================== */}

        <div
          style={{
            marginTop: "15px"
          }}
        >

          <Link to="/login">
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;