import React, { useState } from "react";
import "./ReviewForm.css"; // Assuming you have a CSS file for styles

const ReviewForm = () => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(1);
  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:8000/review/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, rating, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setName("");
        setRating(1);
        setMessage("");
      } else {
        setError(data.error || "Something went wrong");
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
              <label htmlFor="rating">Rating:</label>
              <select
                id="rating"
                name="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
                onChange={(e) => setMessage(e.target.value)}
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
