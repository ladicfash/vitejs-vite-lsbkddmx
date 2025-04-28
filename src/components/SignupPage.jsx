import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext); // Access setUser from UserContext
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    // Simulate signup (replace with actual backend logic)
    if (username && password) {
      const newUser = { username }; // Example user object
      setUser(newUser); // Save the user in context
      navigate("/"); // Redirect to home page after signup
    } else {
      alert("Please provide valid credentials.");
    }
  };

  return (
    <div className="signup-page">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default SignupPage;