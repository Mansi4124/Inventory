import React, { useState, useEffect } from 'react';
import '../Homepage/Homepage.css';
import { Navbar } from 'react-bootstrap';


const testimonials = [
  {
    content: "Zoho Inventory is one of the most easy to implement inventory management solution we have come across, with frequent updates that add more features with each iteration.",
    name: "Ashish Verma",
    designation: "Operations & Logistics Manager, BOHECO",
    image: "ashish-verma.png",
    summary: "Quick product updates",
    backgroundColor: "#d2f3f3"
  },
  {
    content: "The Zoho Inventory app has been really helpful in tracking the movement of key SKUs and the team has been very kind in providing us with solutions to our queries.",
    name: "Team OYO Homes",
    designation: "OYO Homes",
    image: "oyo-homes.png",
    summary: "Active support team",
    backgroundColor: "#ffeeee"
  },
  {
    content: "Zoho Inventory is an awesome software. It's automation feature is really nice. Most of the daily operations can be managed with the use of different APIs.",
    name: "Shubham Chopra",
    designation: "Owner, Chopra Lighthouse",
    image: "shubham.jpg",
    summary: "Automations via API",
    backgroundColor: "#e6e3f3"
  },
  {
    content: "We manage all our inventory, sales, and purchases using Zoho Inventory and Zoho Books. They are easy to learn, easy to apply, and the support team is very helpful. We like Zoho very much!.",
    name: "Venkateswara Rao",
    designation: "Managing Director, Azole Rasayanas Pvt. Ltd.",
    image: "azole-rasayanas.jpeg",
    summary: "Zoho Books integration",
    backgroundColor: "#ebe1bb"
  },
  {
    content: "Zoho Inventory has helped us to manage our inventory and customers efficiently and automate many of our business processes. Its effortless to navigate and its seamless integration with other Zoho products has proven to be very helpful.",
    name: "Sharad Nawalgaria",
    designation: "Director, Fida India",
    image: "fida-india.jpg",
    summary: "Easy-to-use interface",
    backgroundColor: "#bbdeeb"
  }
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % testimonials.length);
    }, 5000); // Change slide every 2 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
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

  return (
    <>
    
    <div className="home-container">
    <section>
      <div>
        <header className="hero">
          <h1>Inventory management software designed for small businesses</h1>
          <p>Manage orders. Track inventory. Handle GST billing. Oversee warehouses. One inventory management software to run all your inventory operations.</p>
          <button className="cta-button">Get Started</button>
        </header>

        <div class="ratings-section">
              <div class="rating-1 rating-block">
                <span class="rating-name">
                  <img src="capterra-logo.svg" alt="https://www.capterra.com/p/146241/Zoho-Inventory/" width="88.8448px"/>
                </span>
                <span class="rating-stars">
                  <img src="4dot5rating.svg" alt="Capterra Review -  Zoho Inventory" width="88.8448px"/>
                </span>
                <span class="rating-number">4.5/<small>5</small></span>
              </div>
              <div class="separation-line"></div>
              <div class="rating-1 rating-block">
                <span class="rating-name">
                  <img src="g2-crowd.svg" alt="https://www.capterra.com/p/146241/Zoho-Inventory/" width="78px"/>

                </span>
                <span class="rating-stars">
                  <img src="4dot5rating.svg" alt="G2-Crowd Review -  Zoho Inventory" width="88.8448px"/>

                </span>
                <span class="rating-number">4.5/<small>5</small></span>
              </div>
              <div class="separation-line"></div>
              <div class="rating-1 rating-block">
                <span class="rating-name">
                  <img src="software_advice.svg" alt="https://www.capterra.com/p/146241/Zoho-Inventory/" width="130px" height="30px"/>
                </span>
                <span class="rating-stars">
                  <img src="4dot5rating.svg" alt="Software Advice Review -  Zoho Inventory" width="88.8448px"/>
                </span>
                <span class="rating-number">4.7/<small>5</small></span>
              </div>
              
              <div class="header-img-section">
                <img src="common-dashboard-1x.png" srcset="common-dashboard-1x.png 1x, common-dashboard-2x.png 2x" alt="Inventory Management Software - Zoho Inventory" class="desktop-view"/>
                <a href="#">Watch the demo</a>
              </div>
          </div>     
      </div>
      </section>
      </div>
      
      
      <section>
      <div class="app-store-section">
          <div class="app-store-section-wrap">
            <h1>Join With Us</h1>
            <br/>
            <h4>and grow your Business with us</h4>
            <a href="#">
            <img class="mobile-badge zoom" src="appstore.png" alt="IOS nventory App - App Store| Zoho Inventory" target="_blank" rel="noopener noreferrer"/>
            </a>
            <a href="#">
            <img class="mobile-badge zoom" src="playstore.png" alt="Android Inventory App - App Store| Zoho Inventory" target="_blank" rel="noopener noreferrer"/>
            </a>
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
                <div className="testimonial-summary">
                  <h6>What they like about Zoho Inventory</h6>
                  <h2>{testimonial.summary}</h2>
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


        {/* footer */}
            
        <footer class="section-p1 home-container">
        <div class="col">
            <img class="logo" src="no/favicon.ico" alt="logo"/>
            {/* <h4>Contact</h4> */}
            {/* <p><strong>Address: </strong> 123 prahladnagar road,ahmedabad</p> */}
            {/* <p><strong>Phone: </strong>+91 1234567890/+91 4412290900</p> */}
            {/* <p><strong>Hours:</strong>10:00 - 22:00,MON-SAT</p> */}
            
        </div>
        <div class="col">
            <h4>Features</h4>
            <a href="#">Order Management Software</a>
            <a href="#">Inventory Management System</a>
            <a href="#">Inventory Control</a>
            <a href="#">Inventory Reports</a>
            <a href="#">All features</a>
        </div>
        <div class="col">
            <h4>About</h4>
            <a href="#">My Account</a>
            <a href="#">Sign In</a>
            <a href="#">View Inventory</a>
            <a href="#">Contact us</a>
            <a href="#">Help</a>
        </div>
        <div class="col install">
            <p>Secured Payment Gateways</p>
            <img src="pay.png" alt=""/>
          <div class="follow">
                  <h4>Follow us</h4>
                  <div class="icon">
                      <i class="fab fa-facebook-f"></i>
                      <i class="fab fa-twitter"></i>
                      <i class="fab fa-instagram"></i>
                      <i class="fab fa-pinterest-p"></i>
                      <i class="fab fa-youtube"></i>
                  </div>
            </div>
         </div>
    </footer>

        
      </>
  );
};

export default HomePage;
