import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [recoveryPin, setRecoveryPin] = useState("");

  const [showRecoveryPin, setShowRecoveryPin] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", form);

      // Get recovery PIN from backend
      if (res.data.recoveryPin) {
        setRecoveryPin(res.data.recoveryPin);
        setShowRecoveryPin(true);
      } else {
        alert(res.data.message);
        navigate("/login");
      }

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  const handleContinueToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-page">

      {!showRecoveryPin ? (

        <form
          className="register-card"
          onSubmit={handleSubmit}
        >
          <h1>Create Account 🚀</h1>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Register
          </button>
        </form>

      ) : (

        <div className="register-card">

          <h1>
            Registration Successful 🎉
          </h1>

          <p>
            Your account has been created successfully.
          </p>

          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              border: "2px solid #2563eb",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >

            <p>
              <strong>
                Your Recovery PIN
              </strong>
            </p>

            <h2
              style={{
                letterSpacing: "6px",
                margin: "15px 0",
              }}
            >
              {recoveryPin}
            </h2>

            <p
              style={{
                fontSize: "14px",
                color: "#666",
              }}
            >
              Save this PIN safely.
              <br />
              You will need it if you forget
              your password.
            </p>

          </div>

          <button
            type="button"
            onClick={handleContinueToLogin}
            style={{
              marginTop: "20px",
            }}
          >
            Continue to Login
          </button>

        </div>

      )}

    </div>
  );
}

export default Register;