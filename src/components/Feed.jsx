import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { supabase } from "../supabase";
import './Feed.css';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select(`
            *,
            users!posts_user_id_fkey (username, profile_pic)
          `) // Use the correct foreign key relationship
          .order("created_at", { ascending: false });
    
        if (error) {
          throw error;
        }
    
        setPosts(data || []);
        setFilteredPosts(data || []); // Initially, filteredPosts = all posts
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter((post) =>
          post.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, posts]);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p className="error-message">Failed to load posts: {error.message}</p>;
  }

  return (
    <div className="feed">
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p>No matching posts found.</p>
      )}
    </div>
  );
}

export default Feed;