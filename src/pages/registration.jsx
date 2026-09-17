import '../App.css';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/config";


function Registration() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_BASE}/api/register`,
        {
          name,
          email,
          password,
        }
      );

      alert(res.data.message);
      navigate("/");

    } catch (err) {

      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Server Error");
      }

    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">

        <div className="registration-card">
          <h2>Create Account</h2>
          <p className="subtitle">
            Create your account to get started
          </p>
          {message && <p>{message}</p>}

          <form className="form-group" onSubmit={handleSubmit}>

              <label htmlFor="name">Name</label>
              <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
  
            <label htmlFor="email">Email</label>    
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="register-btn" type="submit" >
              Register  
            </button>

          </form>

          <p className="login-text">
            Already have an account?{" "}
            <Link to="/">Login</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Registration;