import React, { useEffect, useState, useContext } from "react";
import { supabase } from "../supabase";
import { UserContext } from "../context/UserContext";
import "./PostPage.css";

function Comments({ postId }) {
  const { userId } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        setError("Failed to load comments. Please try again later.");
        setComments([]);
      } else {
        setComments(data);
      }
      setLoading(false);
    };

    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() && !videoFile) {
      setError("Comment or video is required.");
      return;
    }

    setError(null);
    let videoUrl = null;

    if (videoFile) {
      const { data, error } = await supabase.storage
        .from("videos")
        .upload(`comments/${Date.now()}_${videoFile.name}`, videoFile);

      if (error) {
        setError("Failed to upload video. Please try again.");
        return;
      }

      videoUrl = supabase.storage.from("videos").getPublicUrl(data.path).data.publicUrl;
    }

    const { data, error } = await supabase.from("comments").insert({
      content: newComment.trim(),
      post_id: postId,
      user_id: userId,
      video_url: videoUrl,
    });

    if (error) {
      setError("Failed to add comment. Please try again.");
    } else {
      setComments([...comments, data[0]]);
      setNewComment("");
      setVideoFile(null);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      setError("Failed to delete comment. Please try again.");
    } else {
      setComments(comments.filter((comment) => comment.id !== commentId));
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      {loading ? (
        <div>Loading comments...</div>
      ) : (
        <>
          {comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p>{comment.content}</p>
                {comment.video_url && (
                  <div className="comment-video">
                    <video controls className="post-video">
                      <source src={comment.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                {comment.user_id === userId && (
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </>
      )}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <input
          type="file"
          accept="video/mp4,video/x-m4v,video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding Comment..." : "Add Comment"}
        </button>
      </form>
    </div>
  );
}

export default Comments;