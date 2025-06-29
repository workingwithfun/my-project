import React, { useState, useEffect } from "react";
import "./style.css";
import "react-phone-input-2/lib/style.css"; 
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaSearch, FaTimes, FaBars,FaUserCircle } from "react-icons/fa";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
const EditingPage = () => {
  const scrollToEditSection = () => {
    const section = document.getElementById("edit-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error("Element with ID 'edit-section' not found.");
    }
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
    <div className="edit-container">
    <section className="nedit-container">
        {/* Left Side - Text */}
        <div className="image-section">
        <img
          src="https://collage-maker.com/wp-content/uploads/fce-header-motif-7.png"
          alt="Creative Work"
        />
      </div>
        

        {/* Right Side - Image Grid */}
        <div className="edit-text">
          <h1>Professional Photo & Video Editing</h1>
          <p>
            Transform your visuals into stunning masterpieces with our expert editing services. 
            Whether it's enhancing photos or crafting cinematic videos, our skilled professionals 
            ensure perfection in every detail.
          </p>
          <button className="edit-btn" onClick={scrollToEditSection}>Explore Our Work</button>
        </div>
      </section>

      {/* About Section */}
{/* Why Choose Us Section */}
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

<h1 className="main-heading">Our Professional Services</h1>
      {/* Photo Editing Section */}
      <section id ="edit-section" className="edit-section">
        
          {/* Left Side - Image */}
      <div className="image-section">
        <img
          src="https://t4.ftcdn.net/jpg/01/52/81/19/360_F_152811959_HXEzcRFeKLdLZoK5fFhINsDFOoM5cJzj.jpg"
          alt="Creative Work"
        />
      </div>

      {/* Right Side - Text */}
      <div className="text-section">
        <h1>  Portrait Photo Editing</h1>
        <p>
      
Only $6 per photo. We will make portrait photos look good and professionally edited.
Our retouchers will enhance body shapes and skin texture, remove all unwanted imperfections making your models look realistically edited.
        </p>
        <button className="btn">Explore Our Work</button>
      </div>

      </section>
      <section id ="edit-section" className="edit-section">
        
        {/* Left Side - Image */}
    <div className="image-section">
      <img
        src="https://t4.ftcdn.net/jpg/01/52/81/19/360_F_152811959_HXEzcRFeKLdLZoK5fFhINsDFOoM5cJzj.jpg"
        alt="Creative Work"
      />
    </div>

    {/* Right Side - Text */}
    <div className="text-section">
      <h1>  Portrait Photo Editing</h1>
      <p>
    
Only $6 per photo. We will make portrait photos look good and professionally edited.
Our retouchers will enhance body shapes and skin texture, remove all unwanted imperfections making your models look realistically edited.
      </p>
      <button className="btn">Explore Our Work</button>
    </div>

    </section>
    <section id ="edit-section" className="edit-section">
        
        {/* Left Side - Image */}
    <div className="image-section">
      <img
        src="https://t4.ftcdn.net/jpg/01/52/81/19/360_F_152811959_HXEzcRFeKLdLZoK5fFhINsDFOoM5cJzj.jpg"
        alt="Creative Work"
      />
    </div>

    {/* Right Side - Text */}
    <div className="text-section">
      <h1>  Portrait Photo Editing</h1>
      <p>
    
Only $6 per photo. We will make portrait photos look good and professionally edited.
Our retouchers will enhance body shapes and skin texture, remove all unwanted imperfections making your models look realistically edited.
      </p>
      <button className="btn">Explore Our Work</button>
    </div>

    </section>

      {/* Video Editing Section */}
      <div className="e-v-main-container">
      {/* Heading Section */}
      <h1 className="e-v-main-heading">Professional Video Editing Services</h1>

      {/* Content Section */}
      <div className="e-v-video-container">
        {/* Left Side - Text */}
        <div className="e-v-text-section">
          <h2 className="e-v-heading">Bring Your Stories to Life</h2>
          <p className="e-v-description">
            Our expert video editing services transform raw footage into cinematic experiences.
            Whether it's for social media, business, or personal projects, we ensure high-quality results.
          </p>
          <button className="e-v-btn">Explore Our Work</button>
        </div>

        {/* Right Side - Video */}
        <div className="e-v-video-section">
          <video controls className="e-v-video">
            <source
              src="/images/wed-1.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
  
      <div className="e-v-video-container">
        {/* Left Side - Text */}
        <div className="e-v-text-section">
          <h2 className="e-v-heading">Bring Your Stories to Life</h2>
          <p className="e-v-description">
            Our expert video editing services transform raw footage into cinematic experiences.
            Whether it's for social media, business, or personal projects, we ensure high-quality results.
          </p>
          <button className="e-v-btn">Explore Our Work</button>
        </div>

        {/* Right Side - Video */}
        <div className="e-v-video-section">
          <video controls className="e-v-video">
            <source
              src="/images/wed-1.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      {/* Content Section */}
      <div className="e-v-video-container">
        {/* Left Side - Text */}
        <div className="e-v-text-section">
          <h2 className="e-v-heading">Bring Your Stories to Life</h2>
          <p className="e-v-description">
            Our expert video editing services transform raw footage into cinematic experiences.
            Whether it's for social media, business, or personal projects, we ensure high-quality results.
          </p>
          <button className="e-v-btn">Explore Our Work</button>
        </div>

        {/* Right Side - Video */}
        <div className="e-v-video-section">
          <video controls className="e-v-video">
            <source
              src="/images/wed-1.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>  

     {/* How It Works Section */}
<section className="edit-how">
  <h2>How It Works</h2>
  <div className="edit-steps">
    
    <div className="step">
      <div className="step-icon">📤</div>
      <h3>1. Upload Your Files</h3>
      <p>Send us your raw images and videos through our secure platform.</p>
    </div>

    <div className="step">
      <div className="step-icon">🎨</div>
      <h3>2. Professional Editing</h3>
      <p>Our experts enhance your content with precision and creativity.</p>
    </div>

    <div className="step">
      <div className="step-icon">📦</div>
      <h3>3. Final Delivery</h3>
      <p>Receive high-quality, professionally edited visuals ready to use.</p>
    </div>

  </div>
</section>
<h2 className="p-packages-heading">Our Premium Packages</h2>
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

export default EditingPage;
