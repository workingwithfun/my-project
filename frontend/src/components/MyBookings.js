import React, { useState , useEffect} from "react";
import { NavLink } from "react-router-dom";
import "./style.css"; // Import styles
import { FaUser, FaClipboardList, FaCreditCard, FaHeadset, FaBars, FaSignOutAlt, FaCamera, FaVideo,FaPalette,FaBriefcase, FaEdit, FaChevronDown  } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaUserCircle } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import {
  CalendarCheck, Search, Mail, CheckSquare, UploadCloud,
  CreditCard, Wrench, PackageCheck
} from 'lucide-react';
import jsPDF from 'jspdf';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
const [quotationData, setQuotationData] = useState(null);  // Stores structured data
 const [selectedBooking, setSelectedBooking] = useState(null);

const [user, setUser]=useState([]);
useEffect(() => {
  axios.get("http://localhost:8000/api/my-bookings/", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
  .then(res => setBookings(res.data))
  .catch(console.error);
}, []);

  const [isServicesOpen, setIsServicesOpen] = useState(false);
const { logout } = useContext(AuthContext);
//user profile
useEffect(() => {
  axios.get("http://localhost:8000/api/profile/", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
  .then(res => setUser({
    FullName: res.data.name,
    Phone: res.data.phone,
    Email: res.data.email,
    Address: res.data.address || "",
    City: res.data.city || "",
    State: res.data.state || ""
  }))
  .catch(err => console.error("Error fetching profile", err));
}, []);

const handleChange = (e) => {
  const { name, value } = e.target;
  setUser(prev => ({ ...prev, [name]: value }));
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const payload = {
    name: user.FullName,
    phone: user.Phone,
    address: user.Address,
    city: user.City,
    state: user.State
  };

  axios.put("http://localhost:8000/api/profile/update/", payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
  })
  .then(res => {
    setShowSuccess(true);
    setIsEditing(false);
  })
  .catch(err => {
    console.error("Update failed", err);
  });
};


  const [isEditing, setIsEditing] = useState(false);

  const steps = [
    "service booked",
    "service Under Review",
    "Quotation sent by YGP",
    "Quotation approved by customer",
    "Payment request to customer",
    "Payment received",
    "Under Fulfillment",
    "Delivered"
  ];
  const activeStep = steps.indexOf(selectedBooking?.status);

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
  
  // Example: activeStep = 4 means "Quotation approved by customer" is the current step
  
  const [popupImage, setPopupImage] = useState(null);

  const openPopup = (image) => {
    setPopupImage(image);
  };
 
  const [filter, setFilter] = useState("All");

  const handleFilter = (status) => {
    setFilter(status);
  };


  const getStepClass = (index) => {
    if (index < activeStep) return "completed";
    if (index === activeStep) return "active";
    return "";
  };
  


  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile Updated Successfully! ✅");
  };
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("bookings");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  // Sample Data for Pending Payments
  const pendingPayments = [
    { id: 1, service: "Corporate Photoshoot", amount: "$300" },
  ];

  // Function to handle logout

  const StepProgressBar = ({ currentStatus }) => {
    const activeStepIndex = steps.indexOf(currentStatus);
    const progressWidth = `${(100 / (steps.length - 1)) * activeStepIndex}%`;
  
    return (
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: progressWidth }}></div>
        </div>
        <div className="progress-steps">
          {steps.map((step, index) => (
            <div key={index} className={`step ${index <= activeStepIndex ? "active" : ""}`}>
              {step}
            </div>
          ))}
        </div>
      </div>
    );
  };
      
  const [showSuccess, setShowSuccess] = useState(false);


   // const [activeStep, setActiveStep] = useState(0);
  const handleViewQuotation = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const res = await axios.post(
      `http://localhost:8000/api/generate-quotation/${selectedBooking.id}/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setQuotationData(res.data); // Structured data
    setShowQuotationModal(true);
  } catch (err) {
    console.error("Quotation fetch failed", err);
    toast.error("Unable to fetch quotation");
  }
};


const downloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(12);

  const lines = [
    `Quotation`,
    `-------------------------------`,
    `Booking ID: ${selectedBooking.id}`,
    `Service: ${selectedBooking.service}`,
    `Status: ${selectedBooking.status}`,
    ``,
    `Booking Date: ${new Date(selectedBooking.created_at).toLocaleDateString()}`,
    `Service Date: ${selectedBooking.date}`,
    `Time: ${selectedBooking.start_time} – ${selectedBooking.end_time}`,
    ``,
    `Client Info:`,
    `Name: ${selectedBooking.client?.name}`,
    `Phone: ${selectedBooking.client?.phone}`,
    `Email: ${selectedBooking.client?.email}`,
    ``,
    `Social Media Manager:`,
    `Name: ${selectedBooking.manager?.name}`,
    `Phone: ${selectedBooking.manager?.phone}`,
    `Email: ${selectedBooking.manager?.user?.email}`
  ];

  doc.text(lines, 10, 10);
  doc.save(`quotation_${selectedBooking.id}.pdf`);
};

  //logout
 const handleLogout = async () => {
    await logout();      // ✅ Now this calls backend + clears storage
    navigate("/");       // ✅ Redirect after logout
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
                <li onClick={() => navigate("/profile")}>Update Profile</li>
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
    <div className="mybook-dashboard">
      {/* Sidebar */}
      <div className={`mybook-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <button className="mybook-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FaBars />
        </button>
        

        <div className="mybook-menu">
         
          <div className={`mybook-menu-item ${activeSection === "bookings" ? "active" : ""}`} onClick={() => setActiveSection("bookings")}>
            <FaClipboardList className="mybook-icon" />
            {isSidebarOpen && <span>My Bookings</span>}
          </div>
          {/* Services Dropdown */}
        <div className="mybook-menu-item" onClick={() => setIsServicesOpen(!isServicesOpen)}>
          <FaBriefcase className="mybook-icon" />
          {isSidebarOpen && <span>Services <FaChevronDown /></span>}
        </div>

        {isServicesOpen && isSidebarOpen && (
          <div className="mybook-submenu">
            <NavLink to="/video" className="mybook-submenu-item">
              <FaVideo className="mybook-icon" /> Videography
            </NavLink>
            <NavLink to="/photography" className="mybook-submenu-item">
              <FaCamera className="mybook-icon" /> Photography
            </NavLink>
            <NavLink to="/editing" className="mybook-submenu-item">
              <FaEdit className="mybook-icon" /> Editing
            </NavLink>
            <NavLink to="/graphic-design" className="mybook-submenu-item">
              <FaPalette className="mybook-icon" /> Graphic Designing
            </NavLink>
          </div>
        )}

          
          <div className={`mybook-menu-item ${activeSection === "support" ? "active" : ""}`} onClick={() => setActiveSection("support")}>
            <FaHeadset className="mybook-icon" />
            {isSidebarOpen && <span>Customer Care</span>}
          </div>
          <div className={`mybook-menu-item ${activeSection === "profile" ? "active" : ""}`} onClick={() => setActiveSection("profile")}>
            <FaUser className="mybook-icon" />
            {isSidebarOpen && <span>My Profile</span>}
          </div>
         <div className={`mybook-menu-item ${activeSection === "logout" ? "active" : ""}`} onClick={handleLogout}>
  <FaSignOutAlt className="mybook-icon" onClick={handleLogout}/>
  {isSidebarOpen && <span>Logout</span>}
         </div>

      </div>
    </div>

      {/* Main Content */}
      <div className="mybook-main-content">
        {/* Profile Section */}
        {activeSection === "profile" && (
 <div className="mybook-profile">
 <div className="mybook-form-header">
   <h2>My Profile</h2>
   <FaEdit className="profile-edit-icon" onClick={() => setIsEditing(!isEditing)} />
 </div>

 <form onSubmit={(e) => handleFormSubmit(e)} className="mybook-form-container">
   {["FullName", "Phone", "Email", "Address", "City", "State"].map((field) => (
     <div className="mybook-input-container" key={field}>
       <input
         type={field === "Email" ? "email" : "text"}
         name={field}
         value={user[field]}
         onChange={handleChange}
         required
         disabled={!isEditing || (field === "Phone" && user.isPhoneVerified) || (field === "Email" && user.isEmailVerified)}
       />
       <label className={user[field] ? "mybook-filled" : ""}>
         {field.replace(/([A-Z])/g, " $1").trim()}
       </label>
     </div>
   ))}

   {isEditing && <button type="submit" className="mybook-button">Update Profile</button>}
 </form>

 {/* Success Popup */}
 {showSuccess && (
   <div className="success-popup">
     ✅ Profile updated successfully!
   </div>
 )}
</div>
        )}

        {/* Bookings Section */}
        {activeSection === "bookings" && (
  <div className="mybook-bookings">
    <h2>My Bookings</h2>

    {/* Filters Section */}
    <div className="mybook-filters">
      {["All", "service booked", "service Under Review", "Quotation sent by YGP", "Quotation approved by customer", "Payment request to customer", 'Payment received','Under Fulfillment',"Delivered"].map((status) => (
        <button
          key={status}
          className={`mybook-filter-button ${filter === status ? "active" : ""}`}
          onClick={() => handleFilter(status)}
        >
          {status}
        </button>
      ))}
    </div>

    {/* Booking List */}
    
 {bookings.length === 0 ? (
  <div className="no-bookings">
    <p>You haven’t made any bookings yet.</p>
    <button className="book-now-btn" onClick={() => navigate("/book")}>
      Book Now
    </button>
  </div>
) : (
  <div className="mybook-booking-list">
    {bookings
      .filter((booking) => filter === "All" || booking.status === filter)
      .map((booking) => (
        <div
          key={booking.id}
          className="mybook-booking-card"
          onClick={() => setSelectedBooking(booking)}
        >
          
          <div className="mybook-booking-content">
            <p><strong>Booking ID:</strong> {booking.id}</p>
            <p><strong>Service:</strong> {booking.service}</p>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Status:</strong> {booking.status}</p>
          </div>
        </div>
      ))}
  </div>
)}



    {selectedBooking && (
  <div className="mybook-popup">
    <div className="mybook-popup-content">

      {/* Close Button */}
      <button className="mybook-close-button" onClick={() => setSelectedBooking(null)}>
        &times;
      </button>

      {/* Title */}
      <h2 className="modal-title">{selectedBooking.service}</h2>

      {/* Order Info Row */}
      <div className="modal-info-row">
        <div className="modal-info-left">
          <p><strong>Order ID:</strong> {selectedBooking.id}</p>
        </div>
        <div className="modal-info-right">
          <p><strong>Booking Date:</strong> {selectedBooking.date}</p>
          <p><strong>Acceptance Date:</strong> {selectedBooking.acceptanceDate}</p>
        </div>
      </div>

      {/* Progress Status Heading */}
      <h4 className="progress-status-heading">Progress Status</h4>

      {/* Stepper */}
<div className="vertical-steps padded-stepper">
  {steps.map((label, index) => {
    const isCompleted = index < activeStep;
    const isActive = index === activeStep;

    const iconMap = {
      "service Booked": <CalendarCheck size={20} color="#555" />,
      "service Under Review": <Search size={20} color="#555" />,
      "Quotation sent by YGP": <Mail size={20} color="#555" />,
      "Quotation approved by customer": <CheckSquare size={20} color="#555" />,
      "Payment request to customer": <UploadCloud size={20} color="#555" />,
      "Payment received": <CreditCard size={20} color="#555" />,
      "Under Fulfillment": <Wrench size={20} color="#555" />,
      "Delivered": <PackageCheck size={20} color="#555" />,
    };

    return (
      <div className="step-row" key={index}>
        <div className={`step-circle ${isCompleted ? "completed" : isActive ? "active" : ""}`}>
          {isCompleted ? "✔" : index + 1}
        </div>

        {index < steps.length - 1 && (
          <div className={`step-line ${isCompleted ? "line-completed" : "line-pending"}`} />
        )}

        <div className="step-content">
          <div className="step-label">
            <span className="step-icon">{iconMap[label]}</span>
            {label}
          </div>

          {/* Quotation Button */}
          {label === "Quotation sent by YGP" &&
            selectedBooking?.status === "Quotation sent by YGP" && (
              <button className="quotation-button" onClick={handleViewQuotation}>
                View Quotation
              </button>
          )}

          {/* Payment Request Button */}
          {label === "Payment request to customer" &&
            selectedBooking?.status === "Payment request to customer" && (
              <button className="payment-button">
                Payment Now
              </button>
          )}
        </div>
      </div>
    );
  })}
</div>


    </div>
    {showQuotationModal && quotationData && (
  <div className="quotation-popup-overlay">
    <div className="quotation-popup-box">
      <button className="close-btn" onClick={() => setShowQuotationModal(false)}>
        &times;
      </button>

      <h2 className="quote-title">📄 Quotation</h2>

      <div className="quote-body">
        <p><strong>Booking ID:</strong> {selectedBooking.id}</p>
        <p><strong>Service:</strong> {selectedBooking.service}</p>
        <p><strong>Status:</strong> {selectedBooking.status}</p>

        <p><strong>Booking Date:</strong> {new Date(selectedBooking.created_at).toLocaleDateString()}</p>
        <p><strong>Service Date:</strong> {selectedBooking.date}</p>
        <p><strong>Time:</strong> {selectedBooking.start_time} – {selectedBooking.end_time}</p>

        <hr />

<p><strong>Client Name:</strong> {selectedBooking.client_name}</p>
<p><strong>Client Phone:</strong> {selectedBooking.phone}</p>
<p><strong>Client Email:</strong> {selectedBooking.email}</p>


        <hr />

{selectedBooking.manager_name && (
  <>
    <p><strong>SMM Name:</strong> {selectedBooking.manager_name}</p>
    <p><strong>SMM Phone:</strong> {selectedBooking.manager_phone}</p>
    <p><strong>SMM Email:</strong> {selectedBooking.manager_email}</p>
  </>
)}


      </div>

      <button className="download-btn" onClick={() => downloadPDF()}>
        📥 Download as PDF
      </button>
    </div>
  </div>
)}

  </div>
)}






        {/* Customer Care Section */}
        {activeSection === "support" && (
         <div className="mybook-support">
         <div className="mybook-support-card">
           <img src="https://a.storyblok.com/f/186009/1000x500/f41c9e9ec7/4-reasons-you-need-to-be-using-the-phone-for-customer-support.png" alt="Phone Support" className="support-icon" />
           <h3>Phone Support</h3>
           <p>Call our 24/7 customer service team for assistance.</p>
           <p className="contact-detail">📞 +1234567890</p>
         </div>
       
         <div className="mybook-support-card">
           <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSScB-ThDcm0WnCGcIqd3sPYkM-urDknbOH_A&s" alt="Email Support" className="support-icon" />
           <h3>Email Support</h3>
           <p>Send us an email, and we'll get back to you shortly.</p>
           <p className="contact-detail">📧 support@example.com</p>
           </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};


export default MyBookings;
