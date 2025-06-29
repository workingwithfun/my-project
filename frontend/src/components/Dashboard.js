import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { FaSearch, FaTimes, FaBars } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-phone-input-2/lib/style.css"; 
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaUserCircle } from "react-icons/fa";
const Dashboard = () => {
  const [dropdown, setDropdown] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
  const [showSearch, setShowSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]); 

  
  const toggleDropdown = (index) => {
    if (isMobile) {
      setDropdown((prev) => (prev === index ? null : index)); // ✅ Fix: Removed setDropdown(null)
    }
  };
  

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

 
  const navigate = useNavigate();

  const handleLogout = async () => {
    const csrfToken = getCookie('csrftoken');
  
    const response = await fetch('http://127.0.0.1:8000/api/users/logout/', {
      method: 'POST',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, 
      },
    });
  
    if (response.ok) {
      console.log('Logout successful');
      localStorage.clear();
      window.location.href = '/home'; 
    } else {
      console.error('Logout failed');
    }
  };
  
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  
  const handleGetStarted = () => {
    navigate('/client-profile');
  };
  const [userName, setUserName] = useState('');
  useEffect(() => {
    const userName = localStorage.getItem('user_name');
    console.log('Stored User:', userName); // ✅ Check if this logs the username
    if (!userName) {
      console.error('User not logged in, redirecting to login...');
      navigate('/home');
    } else {
      setUserName(userName); // ✅ This will update the state for rendering
    }
  }, []);
  
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
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className={`navbar ${showSearch ? "show-search" : ""}`}>
      {/* Hamburger Menu Icon */}
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Company Name */}
      <div className="logo">YourCompany</div>

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {[
          { name: "Growth", roles: ["Digital Marketing Manager", "Growth Hacker", "Business Development Manager", "Project Manager", "Client Success Manager"] },
          { name: "SEO", roles: ["SEO Specialist", "Technical SEO Expert", "Web Analytics Expert", "Digital PR Specialist", "Local SEO Expert", "Conversion Rate Optimization (CRO) Specialist"] },
          { name: "Content", roles: ["Content Marketer", "Social Media Manager", "Copywriter", "Influencer Marketing Manager", "Community Manager", "Podcast Producer"] },
          { name: "Media", roles: ["Cinematographer", "Videographer", "Video Editor", "Motion Graphics Designer", "Animation Specialist", "Drone Operator"] },
          { name: "Ads", roles: ["PPC Specialist", "Google Ads Expert", "Facebook & Instagram Ads Manager", "LinkedIn Ads Expert", "Media Buyer", "Affiliate Marketing Manager", "Web Developer", "UI/UX Designer", "Graphic Designer", "Email Marketing Specialist", "Marketing Automation Expert"] },
          { name: "Services", roles: ["SEO & Web Optimization", "Content Marketing", "Social Media Management", "Paid Advertising", "Branding & Graphic Design", "Video Production & Editing", "Email Marketing & Automation", "Website Development", "E-commerce Solutions", "Analytics & Performance Tracking"] }
        ].map((category, index) => (
          <li
  key={index}
  className={`nav-item ${dropdown === index ? "active" : ""}`}
  onClick={() => isMobile && toggleDropdown(index)}
>
        
            {category.name}

            {/* Dropdown (Appears on Hover for Desktop, Click for Mobile) */}
            <div className={`dropdown ${dropdown === index ? "show" : ""}`}>
              <ul>
                {category.roles.map((role, i) => (
                  <li key={i}>{role}</li>
                ))}
              </ul>
              
            </div>
          </li>
        ))}
      </ul>

      {/* Search Icon */}
      <FaSearch className="search-icon" onClick={toggleSearch} />

      {/* Login Button */}
      <button className="login-btn" onClick={handleLogout}>Logout</button>

      {/* Search Bar */}
      {showSearch && (
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <FaTimes className="close-icon" onClick={toggleSearch} />
        </div>
      )}
    </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1 className="welcome-text">Welcome, {userName}!</h1>
          <p className="hero-description">
            Find the best talents for your project or explore amazing job opportunities. 
            Connect, collaborate, and grow with TalentHire!
          </p>
          <button className="get-started-btn" onClick={handleGetStarted}>Get Started</button>
        </div>
        <div className="hero-image">
          <img src="https://t3.ftcdn.net/jpg/05/68/21/14/360_F_568211453_QYMxPPvCcND8dsFyPIb0NxUamsqXYGjY.jpg" alt="Hero" />
        </div>
      </section>
    </div>
     <footer>
        <div className="foot-cont">
            <div className="sec aboutus">
                <h2>About Us</h2>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Reprehenderit omnis, corporis, provident beatae excepturi veniam error
                    aliquid molestias tenetur cumque dolore? Perferendis aperiam blanditiis rem
                    beatae numquam qui quo perspiciatis.</p>
                <ul class="sci">
                    <li><a href="#"> <i className="bi bi-facebook" ></i></a></li>
                    <li><a href="#"><i className="bi bi-instagram"></i></a></li>
                    <li><a href="#"><i className="bi bi-youtube"></i></a></li>
                    <li><a href="#"><i className="bi bi-twitter"></i></a></li>
                </ul>
            </div>
            <div className="sec quicklinks">
                <h2>Quick Links</h2>
                <ul>
                    <li><a href="#">About</a></li>
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Privacy policy</a></li>
                    <li><a href="#">Terms & conditions</a></li>
                </ul>
            </div>
            <div className="sec contact">
                <h2>Contact Info</h2>
                <ul className="info">
                    <li>
                        <span><i className="fa-solid fa-location-dot" aria-hidden="true"></i></span>
                        <span>Jijamata Chowk, Maruti Mandir Rd, <br/> Pune, Talegaon Dabhade, <br/>Maharashtra
                            410506</span>
                    </li>
                    <li>
                        <span><i className="fa-solid fa-phone"></i></span>
                        <p><a href="1234567890">+1 234 567 890</a></p>
                    </li>
                    <li>
                        <span><i className="fa-solid fa-envelope"></i></span>
                        <p><a href="mailto:nature@gmail.com">nature@gmail.com</a></p>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
    <div className="copyrighttext">
        <p>Copyright © 2025 website. All rights reserved</p>
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

export default Dashboard;

 