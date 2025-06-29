import React from "react";
import './style.css';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
const Footer = () => {
return(

<>
<footer className="footer">
<div className="footer-container">
  {/* Company Info */}
  <div className="footer-section">
    <h3>About Us</h3>
    <p>
      We are a leading digital marketing company helping businesses grow
      through innovative strategies and cutting-edge technology.
    </p>
  </div>

  {/* Services */}
  <div className="footer-section">
    <h3>Our Services</h3>
    <ul className="footer-list">
      <li>SEO Optimization</li>
      <li>Social Media Marketing</li>
      <li>Google Ads</li>
      <li>Content Marketing</li>
      <li>Web Development</li>
    </ul>
  </div>

  {/* Quick Links */}
  <div className="footer-section">
    <h3>Quick Links</h3>
    <ul className="footer-list">
      <li>About</li>
      <li>Services</li>
      <li>Careers</li>
      <li>Contact Us</li>
      <li>Privacy Policy</li>
    </ul>
  </div>

  {/* Contact */}
  <div className="footer-section">
    <h3>Contact Us</h3>
    <p>Email: support@yourcompany.com</p>
    <p>Phone: +91 9876543210</p>
    <p>Address: 123, Business Street, New Delhi</p>
    <div className="social-icons">
      <a href="#" target="_blank" rel="noopener noreferrer">
        <FaFacebookF />
      </a>
      <a href="#" target="_blank" rel="noopener noreferrer">
        <FaInstagram />
      </a>
      <a href="#" target="_blank" rel="noopener noreferrer">
        <FaLinkedinIn />
      </a>
      <a href="#" target="_blank" rel="noopener noreferrer">
        <FaYoutube />
      </a>
    </div>
  </div>
</div>
</footer>
<div className="footer-copyright">
  © 2025 Your Company. All Rights Reserved.
</div>

</>
);
};
export default Footer;