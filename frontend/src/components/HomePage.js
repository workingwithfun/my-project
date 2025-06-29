import React, { useState, useEffect,useRef  } from "react";
import "./style.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaSearch, FaTimes, FaBars,FaUserCircle } from "react-icons/fa";
import axios from "axios";
const HomePage = () => {
  const nameInputRef = useRef(null);
  
  const servicesData = [
    { id: 1, image: 'https://www.constantcontact.com/blog/wp-content/uploads/2024/11/2-Social-media-campaign-examples-blog-thumbnail.png?w=335&h=335&crop=1', title: 'Advanced Social Media Marketing', description: 'Develop and execute comprehensive social media advertising campaigns across.......' },
    { id: 2, image: 'https://wittypen.com/blog/wp-content/uploads/2022/10/Content-marketing-tools-1.jpg', title: 'Content Marketing Strategy', description: 'Craft a comprehensive content marketing plan aligned with client goals. Create a calendar.....' },
    { id: 3, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_Wgd4ZfHqprea3RxVONP-Ujsm02DpoBY8pg&s', title: 'Influencer Marketing', description: 'Identify and collaborate with relevant influencers or industry expert to promote the client brand.....' },
    { id: 4, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-qm08D0nHgb73qlVSIGIQmVrJpOd2yWzyrtriJCUCw3AXFnVl0ymRSZInp7BUx6tgwDY&usqp=CAU', title: 'Marketing Automation', description: 'Implement marketing automation tools to streamline processes, nurture leads,....' },
    { id: 5, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-hTPzxS67KCpdxjn_ToWf-bXtHtMM03_q2I-b8WePfFP9fIa9vc1Nwmh3EgTW1kiGLxU&usqp=CAU', title: 'Dedicated Account Management', description: 'Provide dedicated account management and regular strategy sessions with the client.......' },
    { id: 6, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVNMKAYuGZ17_cm0PhejGnFRpS73OfRJcEM4-6hlgd0Xd4t-AzKFAwnlQGMHMoxRJaxbc&usqp=CAU', title: 'Advanced SEO', description: 'Conduct comprehensive SEO audits, competitor analysis, and implement advanced SEO......' },
    { id: 7, image: 'https://wittypen.com/blog/wp-content/uploads/2022/10/Content-marketing-tools-1.jpg', title: 'PPC Advertising', description: 'Create and manage Google Ads or other PPC campaigns to drive targeted traffic to the......' },
    { id: 8, image: 'https://wittypen.com/blog/wp-content/uploads/2022/10/Content-marketing-tools-1.jpg', title: 'Email Marketing', description: 'Design and send targeted email campaigns to nurture leads, promote products/services,.....' },
    { id: 9, image: 'https://wittypen.com/blog/wp-content/uploads/2022/10/Content-marketing-tools-1.jpg', title: 'Conversion Rate Optimization (CRO)', description: 'Analyze user behavior, conduct A/B testing, and optimize landing pages and conversion.....' },
    { id: 10, image: 'https://wittypen.com/blog/wp-content/uploads/2022/10/Content-marketing-tools-1.jpg', title: 'Advanced Analytics', description: 'Provide in-depth analytics reports, including heatmaps, user flow analysis, and detailed.....' },
    { id: 11, image: 'https://wittypen.com/blog/wp-content/uploads/2022/10/Content-marketing-tools-1.jpg', title: 'Website Optimization', description: 'Ensure the client website is SEO-friendly, has fast loading times, is mobileresponsive,........' },
    { id: 12, image: 'https://wittypen.com/blog/wp-content/uploads/2022/10/Content-marketing-tools-1.jpg', title: 'Social Media Management', description: 'Manage profiles on Facebook, Instagram, Twitter, and LinkedIn. Post engaging content......' },
    { id: 13, image: 'https://wittypen.com/blog/wp-content/uploads/2022/10/Content-marketing-tools-1.jpg', title: 'Content Creation', description: 'Develop high-quality blog posts, articles, infographics, and other content relevant.......' },
  ];
  
  const [step, setStep] = useState("login");

  const navigate = useNavigate(); // Initialize navigate function
const [otp, setOtp] = useState(['', '', '', '']);
const [resendDisabled, setResendDisabled] = useState(false);
const [timer, setTimer] = useState(60);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
  const [showSearch, setShowSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
const API_URL = process.env.REACT_APP_API_URL;
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]); 

  const firstOtpInputRef = useRef(null); // Ref for first OTP input

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        if (firstOtpInputRef.current) {
          firstOtpInputRef.current.focus(); // Auto-focus after delay
        }
      }, 100); // Small delay to ensure the element is rendered
    }
  }, [step]); // Runs only when `step` changes to "otp"

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

/*const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await registerUser(formData);
  console.log("Response:", response);
  if (response.error) {
    alert(response.error);
  } else {
    alert("User registered successfully!");
  }
};*/

// Start Timer Countdown
useEffect(() => {
  if (resendDisabled && timer > 0) {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  } else if (timer === 0) {
    setResendDisabled(false);
  }
}, [timer, resendDisabled]);



// 🔹 Live Timer Countdown
useEffect(() => {
  let interval;
  if (resendDisabled && timer > 0) {
    interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
  } else if (timer === 0) {
    setResendDisabled(false);  // Enable button after 30s
  }

  return () => clearInterval(interval);
}, [resendDisabled, timer]);


  
//otp

const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: ""
});


const handleGetOtp = async () => {
  try {
    await axios.post( `${API_URL}/register/`, formData, { withCredentials: true });
    setStep("verify");
    setResendDisabled(true);
    setTimer(60);
    startResendTimer();
  } catch (err) {
    toast.error("Error sending OTP");
  }
};

const handleVerifyOtp = async () => {
  try {
    const code = otp.join("");
    await axios.post( `${API_URL}/verify-otp/`, {
      email: formData.email,
      otp: code,
    },{ withCredentials: true });
    toast.success("Verified!");
     setFormData({ name: "", email: "", phone: "" });
    setOtp(["", "", "", ""]);
    setStep("login"); 
  } catch (err) {
    toast.error("Invalid or expired OTP");
  }
};

const handleResendOTP = async () => {
   setResendDisabled(true);
  setTimer(30); // ✅ Start 30s countdown when OTP is resent

  try {
    await axios.post( `${API_URL}/resend-otp/`, {
      email: formData.email,
    }, { withCredentials: true });
    setResendDisabled(true);
    setTimer(60);
    startResendTimer();
  } catch (err) {
    toast.error("Error resending OTP");
  }
};

const startResendTimer = () => {
  const interval = setInterval(() => {
    setTimer((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        setResendDisabled(false);
        return 60;
      }
      return prev - 1;
    });
  }, 1000);
};

const handleOtpChange = (index, value) => {
  if (!/^\d?$/.test(value)) return;
  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);
  if (value !== "" && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
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
    <ToastContainer />  {/* ✅ Required for notifications to appear */}
    <div className="container">
      <div className="company-details">
        <h2>Company Details</h2>
        <br/>
        <p>Here goes all the company-related information...</p>
      </div>

    <div className="login-container">
      {/* Your login form here */}
      {step === "login" ? (
        <div className="login-box">
           <img src="https://cengage.my.site.com/resource/1607465003000/loginIcon" alt="Email Sent" />
          <h2>Login</h2>
          <input
  ref={nameInputRef} // ✅ This will auto-focus on form toggle
  type="text"
  value={formData.name}
  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  placeholder="Enter your name"
/>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email} 
            
            onChange={handleChange}
          />
          <div className="phone-input">
          <PhoneInput
        country={"in"} // Default: India 🇮🇳
       
        value={formData.phone}
        onChange={(value) => setFormData({ ...formData, phone: value })} // Allow search for countries
      />
          </div>
          <button className="get-otp" onClick={handleGetOtp}>Get OTP</button>
        </div>
      ) : (
        <div className="otp-box">
          <img src="https://assets-v2.lottiefiles.com/a/9c8592a8-116f-11ee-8e8c-db6cdac8bf86/tw26d66dgp.gif" alt="Email Sent" />
          <h2>Email Verification</h2>
          <p>Enter OTP sent to {formData.email}</p>
          <div className="otp-inputs">
             {otp.map((digit, index) => (
                   <input
                   key={index}
                   id={`otp-input-${index}`} // Unique ID for each input
                  type="text"
                    maxLength="1"
                  value={digit}
                  ref={index === 0 ? firstOtpInputRef : null} // Ref applied only to first input
                  onChange={(e) => handleOtpChange(index, e.target.value)}
               />
              ))}
</div>
           <p className="otp-resend-text">
           Didn't receive OTP? 
           <button onClick={handleResendOTP} disabled={resendDisabled}>
        {resendDisabled ? `Wait ${timer}s` : "Resend OTP"}
      </button>
      
  </p>
  



          <p className="terms">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
          </p>
          <button type="submit" className="get-otp" onClick={handleVerifyOtp}>Verify</button>
        </div>
      )}
    </div>
    </div>

 <div className="services-container">
      <h2 className="services-heading">Services</h2>
      <div className="services-grid">
        {servicesData.map((service) => (
          <div key={service.id} className="service-card">
            <img src={service.image} alt={service.title} className="service-img" />
            <h3>{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>
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

export default HomePage;
