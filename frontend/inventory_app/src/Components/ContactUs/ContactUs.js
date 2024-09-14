import React from 'react';
import './ContactUs.css'; // Assuming you have a CSS file for styles

const ContactUs = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-image">
          <img src="contactusImage.png" alt="Contact Us" />
        </div>
        <div className="contact-details">
          <h2>Contact Us</h2>

          <form>
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              <input type="text" id="fullName" name="fullName" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number:</label>
              <input type="tel" id="contactNumber" name="contactNumber" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea id="message" name="message" rows="4" required></textarea>
            </div>
            <button type="submit" className="cta-button">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
