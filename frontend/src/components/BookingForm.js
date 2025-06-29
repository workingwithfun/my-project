import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Checkbox, FormControlLabel, Button, FormHelperText, Snackbar, Alert } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import "./style.css"; // External CSS
import { useNavigate } from "react-router-dom"; // 🚀 Import useNavigate
import "react-phone-input-2/lib/style.css"; 
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { FaSearch, FaTimes, FaBars,FaUserCircle } from "react-icons/fa";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
const BookingForm = () => {
  const navigate = useNavigate(); // 🚀 Initialize navigation
  const tomorrow = dayjs().add(1, "day"); // Restrict past & today’s date
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHours, setSelectedHours] = useState("");
  const [numPeople, setNumPeople] = useState(""); // Fix: Ensure correct default state
  const [entireDay, setEntireDay] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false); // ✅ Success popup state
   const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
    const [showSearch, setShowSearch] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const API_URL = process.env.REACT_APP_API_URL;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [isMobile]); 
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
  
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };
  
    const toggleSearch = () => {
      setShowSearch(!showSearch);
    };

const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {};
  if (!selectedDate) newErrors.date = "⚠ Date is required.";
  if (!entireDay && !selectedHours) newErrors.hours = "⚠ Please select hours.";
  if (!numPeople) newErrors.numPeople = "⚠ Select the number of people.";
if (!selectedService) newErrors.service = "⚠ Please select a service.";

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  const payload = {
    date: selectedDate ? selectedDate.format('YYYY-MM-DD') : null,
    hours: entireDay ? null : selectedHours,
    num_people: numPeople,
    entire_day: entireDay,
    service: selectedService || "General",
    
  };
console.log("Payload being sent:", payload);

  try {
    await axios.post(`${API_URL}/book/`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    setSuccess(true);
    toast.success("Booking successful! 🎉");
    setTimeout(() => navigate("/mybook"), 1000);
  } catch (error) {
    console.error("Booking failed:", error.response?.data || error.message);
    const msg =
      error.response?.data?.message || "Failed to book. Please try again.";
    toast.error(msg);
  }
};

  return (
    <>   
    
  <ToastContainer position="top-right" autoClose={3000} />
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
    <div className="b-booking__container">
      <h1 className="b-booking__heading">Book Your Session</h1>

      <form className="b-booking__form" onSubmit={handleSubmit}>
        {/* Date Picker */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="b-booking__form-group">
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setErrors({ ...errors, date: false }); // ✅ Remove error instantly
              }}
              
              format="MM/DD/YYYY"
              minDate={tomorrow} // ✅ Restrict past & today
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  className="b-booking__input"
                  InputLabelProps={{ className: "b-booking__label" }}
                  inputProps={{
                    ...params.inputProps,
                    className: "b-booking__input-text",
                    placeholder: "mm/dd/yyyy",
                  }}
                />
              )}
            />
            {errors.date && <p className="b-booking__error">{errors.date}</p>}
            

          </div>
        </LocalizationProvider>

        <div className="b-booking__form-group">
          <TextField
    select
    label="Select Service"
    value={selectedService}
    onChange={(e) => setSelectedService(e.target.value)}
    fullWidth
    className="b-booking__input"
    InputLabelProps={{ className: "b-booking__label" }}
  >
    <MenuItem value="">Select Service</MenuItem>
    <MenuItem value="Photography">Photography</MenuItem>
    <MenuItem value="Videography">Videography</MenuItem>
    <MenuItem value="Editing">Photo & Video Editing</MenuItem>
    <MenuItem value="Graphic Design">Graphic Designing</MenuItem>
    {errors.service && <p className="b-booking__error">{errors.service}</p>}

  </TextField>
              </div>
        {/* Hours Dropdown */}
        <div className="b-booking__form-group">
          <TextField
            select
            label="Select Hours"
            value={selectedHours}
            onChange={(e) =>
              {
                setSelectedHours(e.target.value);
                setErrors({ ...errors, hours: false }); // ✅ Remove error instantly
              }}
            fullWidth
            disabled={entireDay}
            className="b-booking__input"
            InputLabelProps={{ className: "b-booking__label" }}
          >
            {[...Array(24)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1} Hours
              </MenuItem>
            ))}
          </TextField>
          {errors.hours && !entireDay && <p className="b-booking__error">{errors.hours}</p>}
          {entireDay && <p className="b-booking__note">Hours selection is disabled for entire-day bookings.</p>}
        </div>

        {/* Number of People Dropdown */}
        <div className="b-booking__form-group">
        <TextField
              select
              label="Number of People"
              value={numPeople}
              onChange={(e) => {
                setNumPeople(e.target.value);
                setErrors((prev) => ({ ...prev, numPeople: false })); // ✅ Fix: Remove error on change
              }}
              fullWidth
              error={errors.people}
              helperText={errors.people ? "Please select number of people" : ""}
              className="b-booking__input"
            >
              <MenuItem value="">Select People</MenuItem>
              {[...Array(100)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1} People
                </MenuItem>
              ))}
            </TextField>
          {errors.numPeople && <p className="b-booking__error">{errors.numPeople}</p>}
        </div>

        {/* Entire Day Checkbox */}
        <div className="b-booking__form-group b-booking__checkbox-group">
          <FormControlLabel
            control={
              <Checkbox
                checked={entireDay}
                onChange={() => {
                  setEntireDay(!entireDay);
                  if (!entireDay) {
                    setSelectedHours("");
                    setErrors({ ...errors, hours: false }); // ✅ Remove error when entire day is selected
                  }
                }}
              />
            }
            label="Entire Day (12 Hours)"
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" className="b-booking__submit-btn">
          Book Now
        </Button>
      </form>
      {/* ✅ Success Alert Popup
      <Snackbar
          open={success}
          autoHideDuration={3000} // ✅ Closes after 3 seconds
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: "100%" }}>
            Booking Confirmed Successfully! 🎉
          </Alert>
        </Snackbar> */}
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

export default BookingForm;
