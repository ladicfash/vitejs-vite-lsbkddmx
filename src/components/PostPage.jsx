import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase"; // Ensure Supabase is configured
import Comments from "./Comments"; // Import the Comments component
import "./PostPage.css"; 

function PostPage() {
  const { postId } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null); // State for post details
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [editedContent, setEditedContent] = useState(""); // State for edited content
  const [videoFile, setVideoFile] = useState(null); // State for video file
  const [videoUrl, setVideoUrl] = useState(""); // State for video URL

  // Fetch post details when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
      } else {
        setPost(data);
        setEditedContent(data.content); // Pre-fill content for editing
        setVideoUrl(data.video_url || ""); // Set video URL if it exists
      }
    };

    fetchPost();
  }, [postId]);

  // Save edited post
  const saveEdit = async () => {
    const { error } = await supabase
      .from("posts")
      .update({ content: editedContent })
      .eq("id", postId);

    if (error) {
      console.error("Error saving edit:", error);
    } else {
      setPost((prev) => ({ ...prev, content: editedContent }));
      setIsEditing(false);
    }
  };

  // Handle video upload
  const handleVideoUpload = async () => {
    if (!videoFile) {
      alert("Please select a video file to upload.");
      return;
    }

    const fileName = `${postId}-${videoFile.name}`;
    const { data, error } = await supabase.storage
      .from("videos") // Replace with your Supabase storage bucket name
      .upload(fileName, videoFile);

    if (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video. Please try again.");
      return;
    }

    // Get the public URL of the uploaded video
    const { publicUrl } = supabase.storage
      .from("videos")
      .getPublicUrl(fileName);

    // Save the video URL to the post
    const updateError = await supabase
      .from("posts")
      .update({ video_url: publicUrl })
      .eq("id", postId);

    if (updateError.error) {
      console.error("Error saving video URL:", updateError.error);
    } else {
      setVideoUrl(publicUrl);
      alert("Video uploaded successfully!");
    }
  };

  if (!post) {
    return <p>Loading post...</p>;
  }

  return (
    <div className="post-page">
      <div className="post-container">
        <h1 className="post-title">{post.title}</h1>
        {isEditing ? (
          <textarea
            className="post-edit-input"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          ></textarea>
        ) : (
          <p className="post-content">{post.content}</p>
        )}
        <div className="post-actions">
          {isEditing ? (
            <button className="save-button" onClick={saveEdit}>
              Save
            </button>
          ) : (
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>
        <div className="video-upload-section">
          <h2>Video</h2>
          {videoUrl ? (
            <video className="post-video" controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>No video uploaded yet.</p>
          )}
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />
          <button className="upload-button" onClick={handleVideoUpload}>
            Upload Video
          </button>
        </div>
      </div>
      {/* Add Comments component */}
      <Comments postId={postId} />
    </div>
  );
}

export default PostPage;