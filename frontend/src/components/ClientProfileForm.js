import React, { useState, useEffect } from "react";
import { Container, Typography, Stepper, Step, StepLabel, Button, Box, TextField, Grid, MenuItem } from "@mui/material";
import axios from "axios";
import "react-phone-input-2/lib/style.css"; 
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaSearch, FaTimes, FaBars,FaUserCircle } from "react-icons/fa";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
const steps = ["Company Information", "Location Details", "Company Details & Documents"];

const companyTypes = ["Private", "Public", "Startup", "Government", "NGO"];
const countries = ["India"];
const citiesByCountry = {
    India: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata",
      "Pune", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
      "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad",
      "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi",
      "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad",
      "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur",
      "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubballi-Dharwad",
      "Bareilly", "Moradabad", "Mysore", "Gurgaon", "Aligarh", "Jalandhar", "Tiruchirappalli",
      "Bhubaneswar", "Salem", "Mira-Bhayandar", "Thiruvananthapuram", "Bhiwandi", "Saharanpur",
      "Gorakhpur", "Guntur", "Bikaner", "Amravati", "Noida", "Jamshedpur", "Bhilai",
      "Warangal", "Cuttack", "Firozabad", "Kochi", "Bhavnagar", "Dehradun", "Durgapur",
      "Asansol", "Nanded", "Kolhapur", "Ajmer", "Gandhinagar", "Ujjain", "Siliguri",
      "Jhansi", "Ulhasnagar", "Jammu", "Sangli", "Erode", "Mangalore", "Belgaum",
      "Ambattur", "Tirunelveli", "Malegaon", "Gaya", "Jalgaon", "Udaipur", "Maheshtala",
      "Davanagere", "Kozhikode", "Kurnool", "Bokaro Steel City", "Rajahmundry", "Ballari",
      "Agartala", "Bhagalpur", "Latur", "Dhule", "Korba", "Bhilwara", "Brahmapur",
      "Muzaffarnagar", "Ahmednagar", "Mathura", "Kollam", "Avadi", "Kadapa", "Kamarhati",
      "Sambalpur", "Bilaspur", "Shahjahanpur", "Satara", "Bijapur", "Rampur", "Shivamogga",
      "Chandrapur", "Junagadh", "Thrissur", "Alwar", "Bardhaman", "Kulti", "Kakinada",
      "Nizamabad", "Parbhani", "Tumkur", "Hisar", "Ozhukarai", "Bihar Sharif", "Panipat",
      "Darbhanga", "Bally", "Aizawl", "Dewas", "Ichalkaranji", "Tirupati", "Karnal",
      "Bathinda", "Jalna", "Barasat", "Kirari Suleman Nagar", "Purnia", "Satna",
      "Mau", "Sonipat", "Farrukhabad", "Sagar", "Rourkela", "Durg", "Imphal",
      "Ratlam", "Hapur", "Arrah", "Anantapur", "Karimnagar", "Etawah", "Ambarnath",
      "North Dumdum", "Bharatpur", "Begusarai", "New Delhi"],
 };
const statesByCountry = {
 
  India: [ "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
"Lakshadweep", "Delhi", "Puducherry", "Jammu and Kashmir", "Ladakh"],
 };
const industries = ["Technology", "Finance", "Healthcare", "Education", "Manufacturing"];

const ClientProfileForm = () => {

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
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "",
    phone: "",
    email: "",
    country: "",
    address: "",
    city: "",
    state: "",
    description: "",
    industry: "",
    registrationCertificate: null,
  taxIdProof: null,
  companyProfile: null,
  });

  const [files, setFiles] = useState({
    registrationCertificate: null,
    taxIdProof: null,
    companyProfile: null,
  });
  const [errors, setErrors] = useState({});
  const phoneNumber = formData.phoneNumber ? formData.phoneNumber.trim() : "";
  const handleNext = () => {
    let errors = {};
  
    if (activeStep === 0) {
      if (!formData.companyName) errors.companyName = "Company Name is required!";
      if (!formData.companyType)  errors.companyType = "Company Type is required!";
      
      // Phone Number Validation: Required, only numbers, and must be 10 digits
      if (!formData.phoneNumber){
        errors.phoneNumber = "Phone Number is required!";
      } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = "Phone Number must be exactly 10 digits!";
      }
      if (!formData.email) errors.email = "Email Address is required!";
    }
    
    else if (activeStep === 1) {
      // Step 2 Validation (Location)
      if (!formData.country) errors.country = "Country is required!";
      if (!formData.address) errors.address = "Address is required!";
      if (!formData.city) errors.city = "City is required!";
      if (!formData.state) errors.state = "State is required!";
    } 
    
    else if (activeStep === 2) {
      // Step 3 Validation (Company Details & Documents)
      if (!formData.description) errors.description = "Company Description is required!";
      if (!formData.industry) errors.industry = "Industry is required!";
      if (!files.registrationCertificate) errors.registrationCertificate = "Registration Certificate is required!";
      if (!files.taxIdProof) errors.taxIdProof = "Tax ID Proof is required!";
      if (!files.companyProfile) errors.companyProfile = "Company Profile is required!";
    }
  
    setErrors(errors);
  
    if (Object.keys(errors).length === 0) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  
  const navigate = useNavigate();

  

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // ✅ Update formData with user input
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    // ✅ Clear error when user enters valid data
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Removes error message for this field
    }));
  };
  

  
  const [fileErrors, setFileErrors] = useState({
    registrationCertificate: "",
    taxIdProof: "",
    companyProfile: "",
  });


  const handleFileChange = (e, docKey) => {
    const file = e.target.files[0];
  
    if (file) {
      if (file.size > 307200) { // 300KB limit
        setFileErrors((prev) => ({ ...prev, [docKey]: "File size must be less than 300KB!" }));
        setFiles((prev) => ({ ...prev, [docKey]: null })); // Remove file if too large
      } else {
        setFileErrors((prev) => ({ ...prev, [docKey]: "" })); // Clear error
        setFiles((prev) => ({ ...prev, [docKey]: file }));
      }
    }
  };
  

  const validateStep = () => {
    const requiredFields = {
      0: ["companyName", "companyType", "phone", "email"],
      1: ["country", "address", "city", "state"],
      2: ["description", "industry"],
    };

    return requiredFields[activeStep].every((field) => formData[field].trim() !== "");
  };

  const handleSubmit = async () => {
    const data = new FormData();

    // Append form fields
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    // Append files only if they exist
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        data.append(key, files[key]);
      }
    });

    try {
      const response = await axios.post("http://localhost:5000/clients/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile Created!");
      navigate("/client-dashboard");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
};
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
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {activeStep === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required  error={!!errors.companyName}
  helperText={errors.companyName}/>
            </Grid>
            <Grid item xs={12}>
              <TextField select fullWidth label="Company Type" name="companyType" value={formData.companyType} onChange={handleChange} required error={!!errors.companyType}
  helperText={errors.companyType}>
                {companyTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Phone Number" name="phone" value={formData.phoneNumber || ""} // Ensures no "undefined"
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allows numbers
    setFormData((prev) => ({ ...prev, phoneNumber: value }));

    // ✅ Clear error message when user types
    setErrors((prevErrors) => ({
      ...prevErrors,
      phoneNumber: "",
    }));
  }}required error={!!errors.phoneNumber}
  helperText={errors.phoneNumber}/>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required error={!!errors.email}
  helperText={errors.email}/>
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField select fullWidth label="Country" name="country" value={formData.country} onChange={handleChange} required error={!!errors.country}
  helperText={errors.country}>
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} required error={!!errors.address}
  helperText={errors.address}/>
            </Grid>
            <Grid item xs={12}>
              <TextField select fullWidth label="City" name="city" value={formData.city} onChange={handleChange} required  error={!!errors.city}
  helperText={errors.country}>
                {citiesByCountry[formData.country]?.map((city) => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                )) || []}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField select fullWidth label="State" name="state" value={formData.state} onChange={handleChange} required  error={!!errors.state}
  helperText={errors.state}>
                {statesByCountry[formData.country]?.map((state) => (
                  <MenuItem key={state} value={state}>{state}</MenuItem>
                )) || []}
              </TextField>
            </Grid>
          </Grid>
        )}
{activeStep === 2 && (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Company Description"
        multiline
        rows={3}
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        error={!!errors.description}
  helperText={errors.description}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        select
        fullWidth
        label="Industry"
        name="industry"
        value={formData.industry}
        onChange={handleChange}
        required
        error={!!errors.industry}
  helperText={errors.industry}
      >
        {industries.map((industry) => (
          <MenuItem key={industry} value={industry}>{industry}</MenuItem>
        ))}
      </TextField>
    </Grid>

    {/* File Uploads with Warning & Validation */}
    {["registrationCertificate", "taxIdProof", "companyProfile"].map((docKey) => (
      <Grid item xs={12} key={docKey}>
        <Typography variant="body2" color="textSecondary">
          ⚠ Max file size: 300KB
        </Typography>
        <Button variant="contained" component="label">
          {files[docKey] ? "Change File" : `Upload ${docKey.replace(/([A-Z])/g, " $1")}`}
          <input type="file" hidden name={docKey} onChange={(e) => handleFileChange(e, docKey)} />
        </Button>

        {/* Show file name if uploaded */}
        {files[docKey] && (
          <Box mt={1} sx={{ fontSize: 14, fontWeight: "bold", color: "green" }}>
            ✅ Uploaded: {files[docKey].name} ({(files[docKey].size / 1024).toFixed(2)} KB)
          </Box>
        )}

        {/* Show error if file size exceeds limit */}
        {errors[docKey] && (
      <Box mt={1} sx={{ fontSize: 14, fontWeight: "bold", color: "red" }}>
        ❌ {errors[docKey]}
      </Box>
    )}
      </Grid>
    ))}
  </Grid>
)}


        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>Next</Button>
          )}
        </Box>
      </Box>
    </Container>
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

export default ClientProfileForm;
