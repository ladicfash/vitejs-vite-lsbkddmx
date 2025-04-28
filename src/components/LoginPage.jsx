import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase"; 
import { UserContext } from "../context/UserContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); 
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // Supabase login with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        setErrorMessage(error.message); 
        return;
      }

      if (!data.user) {
        console.error("No user returned from login:", data);
        setErrorMessage("Login failed: User not found.");
        return;
      }

      // Debugging: Log the user data before setting it in context
      console.log("User logged in successfully:", data.user);

      // Set the logged-in user in context
      setUser(data.user);

      // Redirect to the home page
      navigate("/");
    } catch (err) {
      console.error("Unexpected login error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-visibility"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        {errorMessage && (
          <div className="error-message" role="alert">
            {errorMessage}
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;