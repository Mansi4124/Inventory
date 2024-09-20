import React, { useState, useEffect } from 'react';
import '../Homepage/Homepage.css';
import { Navbar } from 'react-bootstrap';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';

const testimonials = [
  {
    content: "InventoryIQ Inventory is one of the most easy to implement inventory management solution we have come across, with frequent updates that add more features with each iteration.",
    name: "Ashish Verma",
    designation: "Operations & Logistics Manager, BOHECO",
    image: "review.png",
    summary: "Quick product updates",
    backgroundColor: "#d2f3f3"
  },
  {
    content: "The InventoryIQ Inventory app has been really helpful in tracking the movement of key SKUs and the team has been very kind in providing us with solutions to our queries.",
    name: "Team OYO Homes",
    designation: "OYO Homes",
    image: "oyo-homes.png",
    summary: "Active support team",
    backgroundColor: "#ffeeee"
  },
  {
    content: "InventoryIQ  is an awesome software. It's automation feature is really nice. Most of the daily operations can be managed with the use of different APIs.",
    name: "Shubham Chopra",
    designation: "Owner, Chopra Lighthouse",
    image: "download--3--300.webp",
    summary: "Automations via API",
    backgroundColor: "#e6e3f3"
  },
  {
    content: "We manage all our inventory, sales, and purchases using InventoryIQ Inventory. They are easy to learn, easy to apply, and the support team is very helpful. We like InventoryIQ very much!.",
    name: "Venkateswara Rao",
    designation: "Managing Director, Azole Rasayanas Pvt. Ltd.",
    image: "satisfaction.png",
    summary: "InventoryIQ Books integration",
    backgroundColor: "#ebe1bb"
  },
  {
    content: "InventoryIQ has helped us to manage our inventory and customers efficiently and automate many of our business processes. Its effortless to navigate and its seamless integration with other InventoryIQ products has proven to be very helpful.",
    name: "Sharad Nawalgaria",
    designation: "Director, Fida India",
    image: "good-review.png",
    summary: "Easy-to-use interface",
    backgroundColor: "#bbdeeb"
  }
];

const about = [
  {
    name: "Mansi Patel",
    contactNo: "7862053305",
    image: "mansi.png",
    linkedin: "https://www.linkedin.com/in/mansi-patel-942355270",
    instagram: "https://www.instagram.com/mansii___04/",
    backgroundColor: "#bbdeeb"
  },
  {
    name: "Avani Kathiriya",
    contactNo: "9737893602",
    image: "avani.png",
    linkedin: "https://www.linkedin.com/in/avani-kathiriya-200b24274/",
    instagram: "https://www.instagram.com/avanikathiriya24/",
    backgroundColor: "#ebe1bb"
  },
  {
    name: "Ganpat Kumavat",
    contactNo: "9725370778",
    image: "ganpat.png",
    linkedin: "https://www.linkedin.com/in/ganpat-kumawat-b51571302/",
    instagram: "https://www.instagram.com/ganpat_8_9_0_3/",
    backgroundColor: "#e6e3f3"
  },
  {
    name: "Ketul Patel",
    contactNo: "6352050223",
    image: "ketul.png",
    linkedin: "www.linkedin.com/in/ketul-patel-684899279",
    instagram: "https://www.instagram.com/ketul.234?igsh=OWpqbDM1YW9oYnZh",
    backgroundColor: "#d2f3f3"
  },
  {
    name: "Arya Chaudhary",
    contactNo: "9510425699",
    image: "arya.png",
    linkedin: "https://www.linkedin.com/in/arya-chaudhari-8b164b256/",
    instagram: "https://www.instagram.com/arya_.2378/",
    backgroundColor: "#ffeeee"
  },
]

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
 

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);
 

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + testimonials.length) % testimonials.length);
  };

  const setSlide = (index) => {
    setCurrentSlide(index);
  };

  const [aboutCurrentSlide, setAboutCurrentSlide] = useState(1); // Renamed state variables

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAboutCurrentSlide((prevSlide) => (prevSlide + 1) % about.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const moveToNextAboutSlide = () => {
    setAboutCurrentSlide((aboutCurrentSlide + 1) % about.length);
  };

  const moveToPrevAboutSlide = () => {
    setAboutCurrentSlide((aboutCurrentSlide - 1 + about.length) % about.length);
  };

  const setAboutSlide = (index) => {
    setAboutCurrentSlide(index);
  };

  const handleGetStartedClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/sign_in');
    }
  };
  const getVisibleAboutSlides = () => {
    const prevIndex = (aboutCurrentSlide - 1 + about.length) % about.length;
    const nextIndex = (aboutCurrentSlide + 1) % about.length;
    return [prevIndex, aboutCurrentSlide, nextIndex];
  };


  return (
    <>
      <div className="home-container">
        <section>
          <header className="hero">
            <h1>Inventory management software designed for small businesses</h1>
            <p>Manage orders. Track inventory. Handle GST billing. Oversee warehouses. One inventory management software to run all your inventory operations.</p>
            <button className="cta-button" onClick={handleGetStartedClick}>Get Started</button>
                      </header>

          <div className="ratings-section">
            <div className="rating-1 rating-block">
              <span className="rating-name">
                <img src="capterra-logo.svg" alt="Capterra Review" width="88.8448px" />
              </span>
              <span className="rating-stars">
                <img src="4dot5rating.svg" alt="Capterra Review - InventoryIQ Inventory" width="88.8448px" />
              </span>
              <span className="rating-number">4.5/<small>5</small></span>
            </div>
            <div className="separation-line"></div>
            <div className="rating-1 rating-block">
              <span className="rating-name">
                <img src="g2-crowd.svg" alt="G2-Crowd Review" width="78px" />
              </span>
              <span className="rating-stars">
                <img src="4dot5rating.svg" alt="G2-Crowd Review - InventoryIQ Inventory" width="88.8448px" />
              </span>
              <span className="rating-number">4.5/<small>5</small></span>
            </div>
            <div className="separation-line"></div>
            <div className="rating-1 rating-block">
              <span className="rating-name">
                <img src="software_advice.svg" alt="Software Advice Review" width="130px" height="30px" />
              </span>
              <span className="rating-stars">
                <img src="4dot5rating.svg" alt="Software Advice Review - InventoryIQ Inventory" width="88.8448px" />
              </span>
              <span className="rating-number">4.7/<small>5</small></span>
            </div>

            <div className="header-img-section">
              <img src="dash.jpeg" srcSet="common-dashboard-1x.png 1x, common-dashboard-2x.png 2x" alt="Inventory Management Software - InventoryIQ Inventory" className="desktop-view" />
              <a href="#">Watch the demo</a>
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="app-store-section">
          <div className="app-store-section-wrap">
            <p>Still doing your Inventory</p>
            <p>Management on Excel?</p>
            <br />
            <h4>Join With Us & Grow your Business with Us</h4>
          </div>
        </div>
      </section>

      <section className="carousel-section">
        <div className="carousel">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`carousel-content ${index === currentSlide ? 'active' : ''}`}
            >
              <div
                className="testimonial-block"
                style={{ backgroundColor: testimonial.backgroundColor }}
              >
                <p className="testimonial-content">{testimonial.content}</p>
                <div className="customer-section">
                  <img src={testimonial.image} alt={`Customer ${testimonial.name}`} />
                  <div className="customer-details">
                    <p className="customer-name">{testimonial.name}</p>
                    <p className="customer-designation">{testimonial.designation}</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-summary responsive">
                <h2>What they like about InventoryIQ Inventory</h2>
                <p>{testimonial.summary}</p>
              </div>
            </div>
          ))}
          <button className="prev-arrow" onClick={prevSlide}>&#10094;</button>
          <button className="next-arrow" onClick={nextSlide}>&#10095;</button>
        </div>
        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setSlide(index)}
            ></span>
          ))}
        </div>
      </section>

      <section id="features" className="features">
        <h1>Features</h1>

        <div className="features-container">
          <div className="feature">
            <div className="feature-icon">
              <img src="OrderIcon.png" alt="Order Management Iconq1" />
              <h2>Order Management</h2>
            </div>
            <div className="feature-text">
              
              <p>Handle all your sales and purchases activities, manage invoices and bills, and track payments. Our Inventory will help you to track everything.</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <img src="analysis.png" alt="Reports Icon" />
              <h2>Reports</h2>
            </div>
            <div className="feature-text">
              
              <p>Know your inventory aging, vendor payments, sales details, and inventory valuation from a range of reports that can be generated, downloaded, and shared easily.</p>
            </div>
          </div>
        </div>
      </section>


      <section className="about-carousel-section">
      <h1>About Us</h1>
      <div className="about-carousel">
        <button className="prev-arrow" onClick={moveToPrevAboutSlide}>&#10094;</button>

        {getVisibleAboutSlides().map((index) => {
          const person = about[index];
          return (
            <div
              key={index}
              className={`about-carousel-slide ${index === aboutCurrentSlide ? 'active' : ''}`}
              style={{ backgroundColor: person.backgroundColor }}
            >
              <img className = "about-img" src={person.image} alt={`About ${person.name}`} />
              <div className="about-details">
                <h3>{person.name}</h3>
                <p>Contact  : {person.contactNo}</p>
                <p>
                <a href={person.instagram} target= "_blank"><img src='/instagram.png'></img></a>
                <a href={person.linkedin} target= "_blank"><img src='/linkedin.png'></img></a>
                </p>
              </div>
            </div>
          );
        })}

        <button className="next-arrow" onClick={moveToNextAboutSlide}>&#10095;</button>
      </div>

      <div className="about-carousel-dots">
        {about.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === aboutCurrentSlide ? 'active' : ''}`}
            onClick={() => setAboutSlide(index)}
          ></span>
        ))}
      </div>
    </section>

    {/* <section id="contact" className="contact-section">
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
      </section> */}


      <footer className="section-p1">
        <div className="col">
          <img className="logo" src="InventoryIQ.png" alt="logo" />
          <h4>Helps user to manage Inventory & grow.</h4>

        </div>
        <div className="col">
          <h4>Features</h4>
          <a href="/dashboard">Dashboard</a>
          <a href="/inventory">Inventory</a>
          <a href="/contact_us">Contact Us</a>
          <a href="/add-organization">Add Organization</a>

          <a href="/reports">Reports</a>
          <a href="/reports">All features</a>
        </div>
        <div className="col">
          <h4>About</h4>
          <a href="/profile">My Account</a>
          <a href="/my-organization">My Organization</a>
          <a href="/features">Features</a>
          <a href="/sign_in">Sign In</a>
          <a href="/contact_us">Get Support</a>
        </div>
        
      </footer>
    </>
  );
};

export default HomePage;
