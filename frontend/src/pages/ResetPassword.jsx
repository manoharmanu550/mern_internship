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


  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    // Password length
    if (password.length < 6) {

      setError(
        "Password must contain at least 6 characters"
      );

      return;
    }


    // Password match
    if (password !== confirmPassword) {

      setError(
        "Passwords do not match"
      );

      return;
    }


    try {

      setLoading(true);


      const response = await API.post(
        `/auth/reset-password/${token}`,
        {
          password: password
        }
      );


      setMessage(
        response.data.message
      );


      // Go to login after 2 seconds
      setTimeout(() => {

        navigate("/login");

      }, 2000);


    } catch (err) {

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

        <h2>Reset Password</h2>


        <p>
          Enter your new password below.
        </p>


        <form onSubmit={handleSubmit}>

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />


          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            required
          />


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Resetting..."
              : "Reset Password"}

          </button>

        </form>


        {message && (

          <p className="success-message">
            {message}
          </p>

        )}


        {error && (

          <p className="error-message">
            {error}
          </p>

        )}


        <Link to="/login">
          Back to Login
        </Link>

      </div>

    </div>
  );
}


export default ResetPassword;