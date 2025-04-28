import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar";
import Feed from "./components/Feed";
import CreatePost from "./components/CreatePost";
import PostPage from "./components/PostPage";
import ProfilePhotoUpload from "./components/ProfilePhotoUpload";
import VideoPlayer from "./components/VideoPlayer";
import EditPostModal from "./components/EditPostModal";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import RequireAuth from "./components/RequireAuth";
import Header from "./components/Header";
import "./Styles.css";

function App() {
  const [refreshFeed, setRefreshFeed] = useState(false);

  const handlePostCreated = () => {
    setRefreshFeed(!refreshFeed); 
  };

  return (
    <UserProvider>
      <div className="app">
        <Navbar />
        <Routes>
          {/* Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Signup Page */}
          <Route path="/signup" element={<SignupPage />} />

          {/* Main Feed with CreatePost */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <div className="main-feed">
                  <div className="create-post-container">
                    <CreatePost onPostCreated={handlePostCreated} />
                  </div>
                  <Feed key={refreshFeed} />
                </div>
              </RequireAuth>
            }
          />

          {/* Individual Post Page */}
          <Route path="/posts/:postId" element={<PostPage />} />

          {/* Profile Photo Upload Page */}
          <Route
            path="/profile-photo"
            element={
              <RequireAuth>
                <ProfilePhotoUpload />
              </RequireAuth>
            }
          />

          {/* Video Player Page */}
          <Route path="/video-player" element={<VideoPlayer />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

console.log("Current route rendering...");

export default App;