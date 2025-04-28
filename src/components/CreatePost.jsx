import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";

function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [users, setUsers] = useState([]); // Replace profiles with users

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  console.log("User data in PostCard:", users);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Creating post with:", { title, content });

    const { data, error } = await supabase.from("posts").insert([
      {
        title,
        content,
      },
    ]);

    if (error) {
      console.error("Error creating post:", error);
    } else {
      console.log("Post created:", data);
      setTitle("");
      setContent("");
      onPostCreated(); // Notify parent to refresh feed
    }
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;