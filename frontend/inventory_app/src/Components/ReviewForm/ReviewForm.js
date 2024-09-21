import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReviewForm.css";

const ReviewForm = () => {
  const [name, setName] = useState("");
  const [review_message, setReview_message] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState(null);

  const getCookie = (name) => {
    const cookieName = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchedUserId = getCookie('userId');
    if (fetchedUserId) {
      setUserId(fetchedUserId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8000/review/", {
        user_id: userId,
        name: name,
        review_message: review_message,
        msg: msg,
      });
      if(response.data.success) {
        setSuccess("Review submitted successfully");
        setName("");
        setReview_message("");
        setMsg("");
        setTimeout(() => {
          setSuccess("");
        }, 2000);
      }
    } catch (err) {
      setError("Failed to send review");
    }
  };

  return (
    <div className="review-screen">
      <section id="review" className="review-section">
        <div className="review-container">
          <h2>Submit Your Review</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={review_message}
                onChange={(e) => setReview_message(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="message-m">What You Like About InventoryIQ:</label>
              <textarea
                id="message-m"
                name="message-m"
                rows="1"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="cta-button">
              Submit Review
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </div>
      </section>
    </div>
  );
};

export default ReviewForm;