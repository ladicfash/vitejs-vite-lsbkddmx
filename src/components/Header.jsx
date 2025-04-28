import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Header() {
  const { user } = useContext(UserContext);

  return (
    <header className="app-header">
      <h1>My App</h1>
      <div className="user-info">
        {user && user.email ? (
          <p>Welcome, {user.email}!</p>
        ) : (
          <p>Please log in</p>
        )}
      </div>
    </header>
  );
}

export default Header;