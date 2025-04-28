import React, { useState } from "react";
import { supabase } from "../supabase";
import "./ProfilePhotoUpload.css";

function ProfilePhotoUpload() {
  const [file, setFile] = useState(null); // State to store the selected file
  const [loading, setLoading] = useState(false); // Loading state for the upload process

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log("File selected:", selectedFile);
      setFile(selectedFile);
    } else {
      console.log("No file selected");
      setFile(null); // Reset file if no file is selected
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    console.log("File before upload:", file); // Log the file state for debugging
    if (!file) {
      alert("Please select a file first!"); // Ensure a file is selected
      return;
    }

    setLoading(true); // Set loading state
    try {
      const fileName = `profile-photos/${Date.now()}-${file.name}`;
      console.log("Uploading file:", file);

      // Upload the file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        alert("Failed to upload file.");
        setLoading(false);
        return;
      }

      console.log("Upload successful:", data);

      // Get the public URL of the uploaded file
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(fileName);

      if (publicUrlError) {
        console.error("Error getting public URL:", publicUrlError);
        alert("Failed to generate public URL.");
        setLoading(false);
        return;
      }

      const publicUrl = publicUrlData.publicUrl;
      console.log("File public URL:", publicUrl);

      // Get the authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError);
        alert("Cannot fetch user details. Please log in.");
        setLoading(false);
        return;
      }

      // Update the user's profile with the new profile picture URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_pic: publicUrl })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        alert("Failed to update profile picture.");
      } else {
        alert("Profile picture updated successfully!");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="profile-photo-upload">
      <h2>Upload Your Profile Picture</h2>
      {/* File input */}
      <input type="file" onChange={handleFileChange} />
      {/* Upload button */}
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default ProfilePhotoUpload;