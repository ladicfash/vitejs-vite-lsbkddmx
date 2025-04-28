import React, { useState } from "react";
import "./ReadMoreModal.css";

function ReadMoreModal({ content, videoUrl }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="read-more-container">
      <button className="read-more-btn" onClick={handleOpenModal}>
        Read More
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={handleCloseModal}>
              &times;
            </button>
            <div className="modal-body">
              <p>{content}</p>
              {videoUrl ? (
                <div className="video-container">
                  <video controls>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <p className="no-video-text">No video uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadMoreModal;