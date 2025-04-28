import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, setUser } = useContext(UserContext); // Access user and setUser from context
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Clear the user state
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <h1>My Venting App</h1>
      {user && (
        <div className="user-info">
          <span>Welcome, {user.username}!</span> {/* Display logged-in user's name */}
        </div>
      )}
      <div>
        {!user ? (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/signup")}>Signup</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate("/profile-photo")}>Profile Photo</button>
            <button onClick={() => navigate("/video-player")}>Video Player</button>
            <button onClick={() => navigate("/edit-post")}>Edit Post</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;