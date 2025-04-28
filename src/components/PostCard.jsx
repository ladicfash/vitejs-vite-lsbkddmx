import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import "./PostCard.css";
import { Link } from "react-router-dom";

function PostCard({ post }) {
  const { id, title, content, profiles } = post;
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null); // Track user's reaction

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error fetching session:", sessionError.message);
          return;
        }
        if (!session) {
          console.error("Auth session missing!");
          return;
        }

        const userId = session.user.id;

        const { data, error } = await supabase
          .from("post_reactions")
          .select("reaction_type, user_id")
          .eq("post_id", id);

        if (error) throw error;

        const likeCount = data.filter((reaction) => reaction.reaction_type === "like").length;
        const dislikeCount = data.filter((reaction) => reaction.reaction_type === "dislike").length;

        setLikes(likeCount);
        setDislikes(dislikeCount);

        const userReaction = data.find((reaction) => reaction.user_id === userId);
        setUserReaction(userReaction?.reaction_type || null);
      } catch (error) {
        console.error("Error fetching reactions:", error.message);
      }
    };

    fetchReactions();
  }, [id]);

  const handleReaction = async (reactionType) => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError.message);
        alert("An error occurred while checking your login status. Please try again.");
        return;
      }
      if (!session) {
        console.error("Auth session missing!");
        alert("You must be logged in to react to posts.");
        return;
      }

      const userId = session.user.id;

      const { error } = await supabase
        .from("post_reactions")
        .upsert(
          { post_id: id, user_id: userId, reaction_type: reactionType },
          { onConflict: ["post_id", "user_id"] }
        );

      if (error) {
        console.error("Error updating reaction:", error.message);
        return;
      }

      if (userReaction === reactionType) {
        // Remove reaction
        if (reactionType === "like") setLikes((prev) => prev - 1);
        if (reactionType === "dislike") setDislikes((prev) => prev - 1);
        setUserReaction(null);
      } else {
        // Add or update reaction
        if (reactionType === "like") {
          setLikes((prev) => (userReaction === "dislike" ? prev + 1 : prev + 1));
          setDislikes((prev) => (userReaction === "dislike" ? prev - 1 : prev));
        } else if (reactionType === "dislike") {
          setDislikes((prev) => (userReaction === "like" ? prev + 1 : prev + 1));
          setLikes((prev) => (userReaction === "like" ? prev - 1 : prev));
        }

        setUserReaction(reactionType);
      }
    } catch (error) {
      console.error("Error handling reaction:", error.message);
    }
  };

  return (
    <div className="post-card-modern">
      <div className="post-header">
        <img
          src={profiles?.profile_pic || "https://cdn-icons-png.flaticon.com/512/2115/2115958.png"}
          alt={`${profiles?.username || "anonymous"}'s profile`}
          className="profile-pic"
        />
        <div className="username-container">
          <span className="username">{profiles?.username || "anonymous"}</span>
          <span className="post-timestamp">• 2 hours ago</span>
        </div>
      </div>
      <div className="post-content">
        <h3 className="post-title">{title || "Untitled Post"}</h3>
        <p className="post-snippet">{(content?.substring(0, 100) || "No content available.") + "..."}</p>
      </div>
      <div className="post-footer">
        <div className="reaction-buttons">
          <button
            className={`reaction-button ${userReaction === "like" ? "active" : ""}`}
            onClick={() => handleReaction("like")}
          >
            👍 {likes}
          </button>
          <button
            className={`reaction-button ${userReaction === "dislike" ? "active" : ""}`}
            onClick={() => handleReaction("dislike")}
          >
            👎 {dislikes}
          </button>
        </div>
        <Link to={`/posts/${id}`} className="read-more-button">
          Read More →
        </Link>
      </div>
    </div>
  );
}

export default PostCard;