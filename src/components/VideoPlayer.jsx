import React, { useState, useEffect } from "react";
import { supabase } from "../supabase"; // Import Supabase client
import "./VideoPlayer.css"; // Import the CSS file

function VideoPlayer() {
  const [videos, setVideos] = useState([]); // State to store all video data
  const [filteredVideos, setFilteredVideos] = useState([]); // State to store filtered videos
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from("helpful_videos") // Table name in the database
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching videos:", error.message);
          return;
        }

        setVideos(data || []);
        setFilteredVideos(data || []); // Initialize filtered videos
      } catch (err) {
        console.error("Unexpected error fetching videos:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = videos.filter(
      (video) =>
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query)
    );

    setFilteredVideos(filtered);
  };

  if (loading) {
    return <p className="loading-text">Loading videos...</p>;
  }

  return (
    <div className="video-library">
      <h1>Helpful Videos</h1>
      <input
        type="text"
        className="search-bar"
        placeholder="Search for videos..."
        value={searchQuery}
        onChange={handleSearch}
      />
      {filteredVideos.length === 0 ? (
        <p className="no-videos-text">No videos found. Try a different search.</p>
      ) : (
        <div className="video-grid">
          {filteredVideos.map((video) => (
            <div key={video.id} className="video-item">
              <h2>{video.title}</h2>
              <p>{video.description}</p>
              <video width="100%" controls>
                <source src={video.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;