import React, { useState } from "react";

function EditPostModal() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    console.log("Saving post:", { title, content });
    // Add your save logic here
  };

  return (
    <div className="edit-post-modal">
      <h1>Edit Post</h1>
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Post Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default EditPostModal;