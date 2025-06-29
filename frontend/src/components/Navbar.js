import React, { useState, useEffect} from "react";
import "./style.css";
import "react-phone-input-2/lib/style.css"; 
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaSearch, FaTimes, FaBars,FaUserCircle } from "react-icons/fa";

const Navbar = () => {
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
</>
);
};
export default Navbar;