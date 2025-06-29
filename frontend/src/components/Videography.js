import React, { useState, useEffect } from "react";
import "./style.css";
import "react-phone-input-2/lib/style.css"; 
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaSearch, FaTimes, FaBars,FaUserCircle } from "react-icons/fa";

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const videoList = [
  "/images/wed-1.mp4",
  "/images/wed-2.mp4",
  "/images/wed-1.mp4",
  "/images/wed-2.mp4",
  "/images/wed-1.mp4",
  "/images/wed-2.mp4",
  "/images/wed-1.mp4",
  "/images/wed-2.mp4",
  "/images/wed-1.mp4",
];


const Videography = () => {
    const scrollToPackages = () => {
        document.getElementById("p-packages-heading").scrollIntoView({ behavior: "smooth" });
      };
      const navigate = useNavigate(); // Initialize navigate function
        const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
        const [showSearch, setShowSearch] = useState(false);
        const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
      
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      
        const toggleDropdown = () => {
          setIsDropdownOpen(!isDropdownOpen);
        };
      
      
        useEffect(() => {
          const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
          };
      
          window.addEventListener("resize", handleResize);
          return () => window.removeEventListener("resize", handleResize);
        }, [isMobile]); 
        
      
        const toggleMenu = () => {
          setMenuOpen(!menuOpen);
        };
      
        const toggleSearch = () => {
          setShowSearch(!showSearch);
        };
      // Check if user is logged in (Assume login status is stored in localStorage)
      const isLoggedIn = localStorage.getItem("authToken");
  return (
    <>
     <nav className={`navbar ${showSearch ? "show-search" : ""}`}>
          {/* Hamburger Menu Icon */}
          <div className="menu-icon" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
    
          {/* Company Name */}
          <div className="logo">YourCompany</div>
    
        {/* Navigation Links */}
    <ul className="nav-links">
    <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/photography" className={({ isActive }) => (isActive ? "active" : "")}>
                Photography
              </NavLink>
            </li>
            <li>
              <NavLink to="/video" className={({ isActive }) => (isActive ? "active" : "")}>
                Videography
              </NavLink>
            </li>
            <li>
              <NavLink to="/editing" className={({ isActive }) => (isActive ? "active" : "")}>
                Photo & Video Editing
              </NavLink>
            </li>
            <li>
              <NavLink to="/graphic-design" className={({ isActive }) => (isActive ? "active" : "")}>
                Graphic Designing
              </NavLink>
            </li>
            <li>
              <NavLink to="/mybook" className={({ isActive }) => (isActive ? "active" : "")}>
                My Bookings
              </NavLink>
            </li>
    
      {/* Profile Dropdown */}
      <li className="profile-menu">
            <div className="profile-icon" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <FaUserCircle />
            </div>
    
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li ><a href= "/create-profile">Create Profile</a></li>
                <li ><a href= "/mybook">Update Profile</a></li>
              </ul>
            )}
          </li>
    </ul>
    
    
          {/* Search Icon */}
          <FaSearch className="search-icon" onClick={toggleSearch} />
    
          {/* Login Button */}
          <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
    
          {/* Search Bar */}
          {showSearch && (
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
              <FaTimes className="close-icon" onClick={toggleSearch} />
            </div>
          )}
        </nav>
    <div className="v-container">

      {/* Hero Section */}
      <header className="v-hero">
        <video autoPlay loop muted className="v-hero-video">
          <source src="/images/video.mp4" type="video/mp4" />
        </video>
        <div className="v-overlay">
          <h1>Capture Your Best Moments</h1>
          <p>Professional Wedding & Event Videography</p>
        </div>
      </header>

      {/* Introduction */}
     
      {/* About Section */}
      <section id="p-about" className="p-about">
  <div className="p-about-container">
    <p>
      At Wedding Bliss, we believe that every wedding is a unique story waiting to be told. 
      Our expert photographers specialize in capturing the essence of love, emotions, and moments 
      that make your big day truly special. From the laughter of friends to the tears of joy, 
      we ensure that every cherished memory is preserved with a touch of creativity and elegance. 
      Our team blends candid photography with artistic compositions to deliver breathtaking visuals 
      that you will treasure forever.
    </p>
    <p>
      With years of experience in wedding photography, we understand the importance of each detail. 
      Whether it's a grand celebration or an intimate ceremony, we are dedicated to making your wedding 
      album a timeless masterpiece. Using state-of-the-art equipment and innovative techniques, we 
      bring your love story to life in the most magical way possible. Let us be a part of your journey 
      and transform fleeting moments into everlasting memories.
    </p>
    <button className="p-book-btn" onClick={scrollToPackages}>Book Now</button>
  </div>
</section>


      {/* Video Grid */}
      <section id="v-videos" className="v-video-grid">
        {videoList.map((video, index) => (
          <video key={index} src={video} autoPlay loop muted controls></video>
        ))}
      </section>
      <h2 className="p-packages-heading" id="p-packages-heading">Our Premium Packages</h2>
    <section id="p-packages" className="p-premium-packages">
 <div className="p-package-card">
    <h3 className="p-package-title">Silver Package</h3>
    <ul className="p-package-details">
      <li>5 Hours of Coverage</li>
      <li>50 Edited Photos</li>
      <li>Digital Album</li>
      <li>2 Professional Photographers</li>
    </ul>
    <button className="p-details-btn">View Details</button>
  </div>

  <div className="p-package-card">
    <h3 className="p-package-title">Gold Package</h3>
    <ul className="p-package-details">
      <li>8 Hours of Coverage</li>
      <li>100 Edited Photos</li>
      <li>Printed Album & Online Gallery</li>
      <li>3 Professional Photographers</li>
    </ul>
    <button className="p-details-btn">View Details</button>
  </div>

  <div className="p-package-card">
    <h3 className="p-package-title">Platinum Package</h3>
    <ul className="p-package-details">
      <li>Full-Day Coverage</li>
      <li>150+ Edited Photos</li>
      <li>Exclusive Pre-Wedding Shoot</li>
      <li>4 Professional Photographers</li>
    </ul>
    <button className="p-details-btn">View Details</button>
  </div>
</section>

    </div>
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

export default Videography;
