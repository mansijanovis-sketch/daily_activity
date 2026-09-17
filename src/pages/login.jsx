import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../App.css';
import { API_BASE } from "../api/config";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password.");
        return;
      }

      // Save logged-in user information
      sessionStorage.setItem("user", JSON.stringify(data.user));

      // Go to dashboard
      navigate("/dashboard");
    } catch (error) {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Section */}
        <div className="login-left">
          <div className="login-brand">
            <h1>DailyActivity</h1>
            <p>Manage your day. Achieve your goals.</p>
          </div>

          <div className="login-welcome">
            <h2>Welcome Back! 👋</h2>

            <p>
              Stay organized, manage your daily activities,
              and keep track of your productivity.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="login-card">

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Login to your account
          </p>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="login-form-group">
              <label htmlFor="login-email">Email Address</label>

              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="login-form-group">
              <label htmlFor="login-password">Password</label>

              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            
            {/* Login Button */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Registration */}
          <p className="register-text">
            Don't have an account?{" "}
            <Link to="/registration">
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;