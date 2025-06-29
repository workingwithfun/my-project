import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./style.css"; // Import CSS
import { useNavigate } from "react-router-dom";
import "react-phone-input-2/lib/style.css"; 
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import { FaSearch, FaTimes, FaBars,FaUserCircle } from "react-icons/fa";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
const CreateProfile = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone1: "",
    phone2: "",
    address: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    setErrors({ ...errors, [name]: "" });
  };

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
  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};
  
    // Required field validation (except phone2)
    Object.keys(formData).forEach((key) => {
      if (key !== "phone2" && formData[key].trim() === "") {
        validationErrors[key] = "This field is required";
      }
    });
  
    // If there are errors, update state and stop submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;  // Stop form submission
    }
  
    // Clear errors if submission is successful
    setErrors({});
  
    Swal.fire("Success!", "Profile created successfully!", "success");
    navigate("/mybook");
  };
  

  return (
    <> <nav className={`navbar ${showSearch ? "show-search" : ""}`}>
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
    <div className="cp-container">
      <h2 className="cp-title">Create Profile</h2>
      <form className="cp-form" onSubmit={handleSubmit}>
        
        {/* First Name & Last Name */}
        <div className="cp-row">
          <div className="cp-group">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`cp-input ${formData.firstName ? "filled" : ""}`}  />
            <label className="cp-label">First Name</label>
            {errors.firstName && <p className="cp-error">{errors.firstName}</p>}
          </div>
          <div className="cp-group">
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`cp-input ${formData.lastName ? "filled" : ""}`} />
            <label className="cp-label">Last Name</label>
            {errors.lastName && <p className="cp-error">{errors.lastName}</p>}
          </div>
        </div>

        {/* Phone Number 1 & 2 */}
        <div className="cp-row">
          <div className="cp-group">
            <input type="tel" name="phone1" value={formData.phone1} onChange={handleChange} className={`cp-input ${formData.phone1 ? "filled" : ""}`}  />
            <label className="cp-label">Phone Number 1</label>
            {errors.phone1 && <p className="cp-error">{errors.phone1}</p>}
          </div>
          <div className="cp-group">
            <input type="tel" name="phone2" value={formData.phone2} onChange={handleChange} className={`cp-input ${formData.phone2 ? "filled" : ""}`} />
            <label className="cp-label">Phone Number 2 (Optional)</label>
          </div>
        </div>

        {/* Address */}
        <div className="cp-group">
          <input type="text" name="address" value={formData.address} onChange={handleChange} className={`cp-input ${formData.address ? "filled" : ""}`}  />
          <label className="cp-label">Address</label>
          {errors.address && <p className="cp-error">{errors.address}</p>}
        </div>

        {/* City & State */}
        <div className="cp-row">
          <div className="cp-group">
            <input type="text" name="city" value={formData.city} onChange={handleChange} className={`cp-input ${formData.city ? "filled" : ""}`}  />
            <label className="cp-label">City</label>
            {errors.city && <p className="cp-error">{errors.city}</p>}
          </div>
          <div className="cp-group">
            <input type="text" name="state" value={formData.state} onChange={handleChange} className={`cp-input ${formData.state ? "filled" : ""}`}  />
            <label className="cp-label">State</label>
            {errors.state && <p className="cp-error">{errors.state}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="cp-button">Create Profile</button>
      </form>
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

export default CreateProfile;
