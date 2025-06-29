import React, {useState, useEffect} from "react";
import "./style.css";
import { FaPaintBrush, FaPenNib, FaLaptop, FaShoppingBag } from "react-icons/fa";
import "react-phone-input-2/lib/style.css"; 
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaSearch, FaTimes, FaBars,FaUserCircle } from "react-icons/fa";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
const GraphicDesigning = () => {
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
    <div className="gd-container">

      {/* Hero Section */}
      <header className="gd-hero">
        <h2>Creative Graphic Designing Services</h2>
        <p>Elevate your brand with stunning graphics!</p>
        <button className="gd-cta-btn">Get a Quote</button>
      </header>

      {/* Introduction Section */}
      <section className="edit-why">
  <div className="w-edit-container">
    {/* Left Side - Text Content */}
    <div className="w-edit-text">
      <h2>Why Choose Us?</h2>
      <p>
        At **[Your Company Name]**, we combine **creativity, precision, and speed** to deliver stunning 
        photo and video edits. Our professional team ensures that every project is handled with 
        **utmost care and attention to detail**.
      </p>
      <p>
        We guarantee a **quick turnaround** without compromising on quality, making sure that your 
        visuals are polished and ready on time. Whether it’s a personal project or a business campaign, 
        we bring your vision to life with **expert craftsmanship**.
      </p>
      <p>
        With a **client-first approach**, we tailor every edit to meet your exact needs. Let us help 
        you create eye-catching content that makes an impact.
      </p>
    </div>

  </div>
</section>


      {/* Portfolio Section */}
      <section className="gd-portfolio">
        <h2>Our Portfolio</h2>
        <div className="gd-portfolio-grid">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE67G_BsC9oXrqFo6ZnjrxSliNhFvJxNwriDaXXIs1rihbQoimZ4vGlD0x4CVhX_4fNfw&usqp=CAU" alt="Design 1" />
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE67G_BsC9oXrqFo6ZnjrxSliNhFvJxNwriDaXXIs1rihbQoimZ4vGlD0x4CVhX_4fNfw&usqp=CAU" alt="Design 2" />
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE67G_BsC9oXrqFo6ZnjrxSliNhFvJxNwriDaXXIs1rihbQoimZ4vGlD0x4CVhX_4fNfw&usqp=CAU" alt="Design 3" />
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE67G_BsC9oXrqFo6ZnjrxSliNhFvJxNwriDaXXIs1rihbQoimZ4vGlD0x4CVhX_4fNfw&usqp=CAU" alt="Design 4" />
        </div>
      </section>

      {/* Services Section */}
      <section className="gd-services">
        <h2>Our Services</h2>
        <div className="gd-services-grid">
          <div className="gd-service-item">
            <FaPaintBrush className="gd-service-icon" />
            <h3>Logo Design</h3>
            <p>Custom logo designs to establish your brand identity.</p>
          </div>
          <div className="gd-service-item">
            <FaPenNib className="gd-service-icon" />
            <h3>Branding</h3>
            <p>Complete branding solutions including color schemes & typography.</p>
          </div>
          <div className="gd-service-item">
            <FaLaptop className="gd-service-icon" />
            <h3>Website Graphics</h3>
            <p>Professional banners, UI elements, and website assets.</p>
          </div>
          <div className="gd-service-item">
            <FaShoppingBag className="gd-service-icon" />
            <h3>Social Media Designs</h3>
            <p>Engaging social media posts, ads, and stories.</p>
          </div>
        </div>
      </section>

      {/* Pricing & Packages */}
      <section className="gd-pricing">
        <h2>Pricing & Packages</h2>
        <div className="gd-pricing-cards">
          <div className="gd-pricing-card">
            <h3>Basic</h3>
            <p>Logo design + 3 social media creatives</p>
            <h4>₹2,999</h4>
            <button className="gd-pricing-btn">Choose Plan</button>
          </div>
          <div className="gd-pricing-card">
            <h3>Standard</h3>
            <p>Branding + Logo + 5 social media creatives</p>
            <h4>₹4,999</h4>
            <button className="gd-pricing-btn">Choose Plan</button>
          </div>
          <div className="gd-pricing-card">
            <h3>Premium</h3>
            <p>Full branding kit + Website graphics + Social media creatives</p>
            <h4>₹9,999</h4>
            <button className="gd-pricing-btn">Choose Plan</button>
          </div>
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

export default GraphicDesigning;
