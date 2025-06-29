
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { FaUsers,FaCheckCircle } from "react-icons/fa";
import Modal from 'react-modal';
import "./style.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  FaBars, FaSignOutAlt, FaUser, FaBriefcase, FaThumbsUp, FaClock, FaTasks, FaChartBar, 
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const professions = [
  "photographer", "videographer", "photo editor", "social media manager",
  "video editor", "graphic designer", "admin", "finance manager"
];

const bookingsData = [];

//feedback
const feedbackData = [
  { id: 1, name: "John Doe", email: "john@example.com", message: "Great service!", date: "2025-04-10" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", message: "Could be better.", date: "2025-04-12" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com", message: "Very professional team.", date: "2025-04-14" },
];
Modal.setAppElement('#root'); // to avoid accessibility warning

const Admin= () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [selectedBooking, setSelectedBooking] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const {logout} = useContext(AuthContext);
const navigate = useNavigate();
const viewDetails = (booking) => {
  setSelectedBooking(booking);
  setIsModalOpen(true);
};
const [activeTab, setActiveTab] = useState('clients');
const closeModal = () => {
  setIsModalOpen(false);
  setSelectedBooking(null);
};

  const token = localStorage.getItem("access_token");
const [managers, setManagers] = useState([]);

   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState('employees');
const [reports, setReports] = useState(() => {
  const stored = localStorage.getItem("uploadedReports");
  return stored ? JSON.parse(stored) : [];
});

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];


    {/*Manage Employee*/}
    const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({
    name: '', profession: '', phone: '', address: '', email: '', salary: ''
  });
  const employeesPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const filteredEmployees = filter ? employees.filter(e => e.profession === filter) : employees;
  const totalPage= Math.ceil(filteredEmployees.length / employeesPerPage);
const indexOfLastEmp = currentPage * employeesPerPage;
const indexOfFirstEmp = indexOfLastEmp - employeesPerPage;
const currentEmployees = filteredEmployees.slice(indexOfFirstEmp, indexOfLastEmp);
const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('employees');
    if (stored) setEmployees(JSON.parse(stored));
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem('employees', JSON.stringify(data));
  };

  {/*Manange client*/}
  const [clients, setClients] = useState([]);
  const toggleEdit = (id) =>
  setClients(prev => prev.map(c => c.id === id ? ({ ...c, isEditing: !c.isEditing }) : c));


  const clientsPerPage = 8;

  useEffect(() => {
    const stored = localStorage.getItem('clients');
    if (stored) {
      setClients(JSON.parse(stored));
    } else {
      setClients(bookingsData);
      localStorage.setItem('clients', JSON.stringify(bookingsData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const clienthandleDelete = (id) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
  };

  const filtered = filter ? bookingsData.filter(c => c.service === filter) :  bookingsData;
  const totalPages = Math.ceil(filtered.length / clientsPerPage);
  const indexOfLast = currentPage * clientsPerPage;
  const indexOfFirst = indexOfLast - clientsPerPage;
  const currentClients = filtered.slice(indexOfFirst, indexOfLast);
//Manage feedback
const [feedbacks, setFeedbacks] = useState([]);
const [selectedFeedback, setSelectedFeedback] = useState(null);

useEffect(() => {
  const stored = localStorage.getItem('feedbacks');
  if (stored) {
    setFeedbacks(JSON.parse(stored));
  } else {
    setFeedbacks(feedbackData);
    localStorage.setItem('feedbacks', JSON.stringify(feedbackData));
  }
}, []);

useEffect(() => {
  localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
}, [feedbacks]);

const handleDeleteFeedback = (id) => {
  const updated = feedbacks.filter(f => f.id !== id);
  setFeedbacks(updated);
};

//employee fetching
const [loading, setLoading] = useState(true);


  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("access_token");
      console.log("API_URL is:", API_URL);

      const response = await axios.get(`${API_URL}/employees/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  fetchEmployees();
}, []);

//add employee
const handleSave = async () => {
  const requiredFields = ['name', 'phone', 'email', 'profession', 'password'];
  for (const field of requiredFields) {
    if (!currentEmployee[field] || currentEmployee[field].trim() === '') {
      toast.warning(`Please fill the ${field} field.`);
      return;
    }
  }
  

  const payload = {
  phone: currentEmployee.phone,
  address: currentEmployee.address,
  profession: currentEmployee.profession,
  salary: currentEmployee.salary,
  name: currentEmployee.name,       // flat
  email: currentEmployee.email,     // flat
  password: currentEmployee.password, // flat
};


  try {
    const response = await axios.post( `${API_URL}/employees/`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    
    setShowModal(false);
    setCurrentEmployee({});
    setEditMode(false);
    toast.success("Employee added successfully!");
    await fetchEmployees();
  } catch (error) {
    console.error("Add employee failed:", error.response?.data || error.message);
    toast.error("Failed to add employee. Please check details.");
  }
};
//fetch bookings

// update
const handleUpdate = async () => {
  try {
    const response = await axios.put(
      `${API_URL}/employees/${currentEmployee.id}/`,
      currentEmployee,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    setEmployees((prev) =>
      prev.map((emp) => (emp.id === currentEmployee.id ? response.data : emp))
    );
    setShowModal(false);
    setCurrentEmployee({});
    setEditMode(false);
    toast.success("Employee updated successfully!");
  } catch (error) {
    console.error("Update failed:", error.response?.data || error.message);
    toast.error("Failed to update employee.");
  }
};

//delete
const handleDelete = async (empId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`${API_URL}/employees/${empId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    setEmployees((prev) => prev.filter((emp) => emp.id !== empId));
    toast.success("Employee deleted successfully!");
  } catch (error) {
    console.error("Delete failed:", error.response?.data || error.message);
    toast.error("Failed to delete employee.");
  }
};

//emp detail
const handleAdd = () => {
  setCurrentEmployee({
    name: "",
    phone: "",
    address: "",
    email: "",
    password:"",
    profession: "",
    salary: "",
  });
 setIsAdding(true);       // ✅ set add mode
  setEditMode(true);       // ✅ enable editing
  setShowModal(true);
};

// edit employee
const handleEdit = (emp) => {
  setCurrentEmployee({
    ...emp,
    name: emp.name || emp.user?.first_name || '',
    email: emp.email || emp.user?.email || '',
  });
  setEditMode(true);
  setIsAdding(false); // not a new employee
  setShowModal(true);
};


//fetch booking
// Fetch data on mount
useEffect(() => {
  fetchBookings();
  fetchManagers();
}, []);

const fetchBookings = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    toast.error("Access token not found. Please log in.");
    return;
  }

  try {
    const res = await axios.get(`${API_URL}/bookings/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setClients(res.data);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      logout();  // this calls your AuthContext logout
      navigate("/login"); // send back to login or homepage
    }
  }
};

const fetchManagers = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    toast.error("Access token not found. Please log in.");
    return;
  }

  try {
    const res = await axios.get( `${API_URL}/social-media-managers/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setManagers(res.data);
  } catch (error) {
    console.error("Error fetching managers:", error);
    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      logout();
      navigate("/login");
    }
  }
};


// Handle manager assignment
const handleManagerChange = async (bookingId, managerId) => {
  try {
    await axios.post(`${API_URL}/tasks/`, {
      booking_id: bookingId,
      manager_id: managerId,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    toast.success("Manager assigned successfully!");
    fetchBookings(); // to refresh the UI
  } catch (error) {
    console.error("Assign failed:", error.response?.data || error.message);
    toast.error("Failed to assign manager.");
  }
};

//logout
const handleLogout = () => {
    logout();            // Clears token
    navigate("/");       // Navigate to home after logout
  };

//report


useEffect(() => {
  if (activeSection === "reports") {
    fetchAllReports();
  }
}, [activeSection]);

const fetchAllReports = async () => {
  try {
    const res = await axios.get(`${API_URL}/reports/all/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    setReports(res.data);
  } catch (err) {
    console.error("Failed to fetch all reports:", err);
  }
};



const handleDeleteReport = async (reportId) => {
  try {
    await axios.delete(`${API_URL}/reports/${reportId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    setReports(reports.filter((r) => r.id !== reportId));
  } catch (err) {
    console.error("Delete failed", err);
  }
};

// on activeSection === 'analytics'


const [summaryData, setSummaryData] = useState({});
const [pieData, setPieData] = useState([]);
const [clientActivity, setClientActivity] = useState([]);

const fetchAnalyticsData = async () => {
  try {
    const res = await axios.get(`${API_URL}/analytics/client-summary/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    const data = res.data;
    console.log("📊 Client Summary Data:", data);

    // ✅ Set summary data
    setSummaryData({
      total_clients: data.total_clients,
      active_projects: data.active_projects,
      inactive_projects: data.inactive_projects,
    });

    // ✅ Set pie chart data
    setPieData([
      { name: "Total Clients", value: data.total_clients },
      { name: "Active Clients", value: data.active_clients },
      { name: "Logged In Today", value: data.logged_in_today },
      { name: "Logged Out Today", value: data.logged_out_today },
    ]);

    // ✅ Set client activity table
    setClientActivity(data.client_logins || []);

  } catch (err) {
    console.error("Failed to fetch analytics", err);
  }
};

// 🧠 Call this in useEffect to run once:
useEffect(() => {
  fetchAnalyticsData();
}, []);

useEffect(() => {
  fetchAnalyticsData();
}, []);

//employee
 const [professionData, setProfessionData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    fetchProfessionStats();
    fetchBookingStats();
    fetchActivityLogs();
  }, []);

const fetchProfessionStats = async () => {
  try {
    const res = await axios.get(`${API_URL}/employee/profession-stats/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    const pieFormatted = res.data.profession_counts.map(item => ({
      name: item.profession,
      value: item.count,
    }));
    setProfessionData(pieFormatted);
  } catch (err) {
    console.error("Profession stats error:", err);
  }
};


const fetchBookingStats = async () => {
  try {
    const res = await axios.get(`${API_URL}/my-bookings/by-profession/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    setBookingData(res.data);
  } catch (err) {
    console.error("Booking stats error:", err);
  }
};

const fetchActivityLogs = async () => {
  try {
    const res = await axios.get( `${API_URL}/employee/activity-logs/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    setActivityLogs(res.data);
  } catch (err) {
    console.error("Activity logs error:", err);
  }
};


const handleDownloadReport = async (reportId, fileName) => {
  try {
    const response = await axios.get(
      `${API_URL}/reports/download/${reportId}/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        responseType: 'blob', // Important!
      }
    );

    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // The file name you want
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Download failed", error);
    alert("Download failed. You may not be authorized.");
  }
};

return (
<div className="smm-dashboard">
  
<ToastContainer position="top-right" autoClose={3000} />
     <div className={`smm-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <button className="smm-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FaBars />
        </button>
        <div className="smm-menu">
          <div className={`smm-menu-item ${activeSection === "employees" ? "active" : ""}`} onClick={() => setActiveSection("employees")}>
            <FaUser />
            {isSidebarOpen && <span>Manange Employees</span>}
          </div>
          <div className={`smm-menu-item ${activeSection === "clients" ? "active" : ""}`} onClick={() => setActiveSection("clients")}>
            <FaBriefcase />
            {isSidebarOpen && <span>Manange clients</span>}
          </div>
        
         
<div className={`smm-menu-item ${activeSection === "feedback" ? "active" : ""}`} onClick={() => setActiveSection("feedback")}>
  <FaThumbsUp />
  {isSidebarOpen && <span>Manage Feedback</span>}
</div>

 <div className={`smm-menu-item ${activeSection === "reports" ? "active" : ""}`} onClick={() => setActiveSection("reports")}>

            <FaTasks />
            {isSidebarOpen && <span>Reports</span>}
          </div>
          <div className={`smm-menu-item ${activeSection === "analytics" ? "active" : ""}`} onClick={() => setActiveSection("analytics")}>
  <FaChartBar/>
  {isSidebarOpen && <span>Analytics</span>}
</div>

          <div className="smm-menu-item logout"  onClick={handleLogout}>
            <FaSignOutAlt />
            {isSidebarOpen && <span>Logout</span>}
          </div>
        </div>
      </div>
            {/* Main Content */}
            {activeSection === "employees" && (
            <div className="smm-main">
               <div className="emp-manage">
      <h2>Manage Employees</h2>

      <div className="emp-controls">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="emp-select">
          <option value="">All Professions</option>
          {professions.map(prof => (
            <option key={prof} value={prof}>{prof}</option>
          ))}
        </select>
        <button onClick={handleAdd} className="emp-btn">Add Employee</button>
      </div>

      <table className="emp-table">
        <thead>
          <tr>
            <th>Name</th><th>Profession</th><th>Phone</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
       <tbody>
       {currentEmployees.map((emp, index) => (
       
            <tr key={emp.phone}>
              <td>{emp.name}</td>
              <td>{emp.profession}</td>
              <td>{emp.phone}</td>
              <td>{emp.email}</td>
              <td>
               <button onClick={() => handleEdit(emp)} className="icon-btn green"> 
  <FaEdit />
</button>

<button onClick={() => handleDelete(emp.id)} className="icon-btn red">
  <FaTrash />
</button>

              </td>
            </tr>
          ))}
      
        </tbody>
      </table>
      {totalPage > 1 && (
  <div className="pagination">
    {[...Array(totalPage)].map((_, i) => (
      <button key={i} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>
        {i + 1}
      </button>
    ))}
  </div>
)}

{showModal && (
  <div className="emp-modal">
    <div className="emp-modal-content">
      <span onClick={() => setShowModal(false)} className="emp-close">&times;</span>
      <h3>Employee Details</h3>
<form className="emp-form">
  {/* Existing fields */}
  {[
    { label: 'Name', key: 'name' },
    { label: 'Phone', key: 'phone' },
    { label: 'Address', key: 'address' },
    { label: 'Email', key: 'email' },
    { label: 'Profession', key: 'profession', isSelect: true },
    { label: 'Salary', key: 'salary' }
  ].map(({ label, key, isSelect }) => (
    <div className="emp-form-group" key={key}>
      {isSelect ? (
        <select
          disabled={!editMode}
          value={currentEmployee[key] || ''}
          onChange={(e) => setCurrentEmployee({ ...currentEmployee, [key]: e.target.value })}
          className={currentEmployee[key] ? 'emp-filled' : ''}
          required
        >
          <option value="" disabled hidden>Select Profession</option>
          {professions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      ) : (
        <input
          type="text"
          placeholder=" "
          disabled={!editMode}
          value={currentEmployee[key] || ''}
          onChange={(e) => setCurrentEmployee({ ...currentEmployee, [key]: e.target.value })}
          className={currentEmployee[key] ? 'emp-filled' : ''}
          required
        />
      )}
      <label>{label}</label>
    </div>
  ))}

  {/* ✅ Password field only when creating a new employee */}
  {isAdding && (
    <div className="emp-form-group">
      <input
        type="password"
        placeholder=" "
        value={currentEmployee.password || ''}
        onChange={(e) =>
          setCurrentEmployee({ ...currentEmployee, password: e.target.value })
        }
        className={currentEmployee.password ? 'emp-filled' : ''}
        required
      />
      <label>Password</label>
    </div>
  )}
</form>


      <div className="emp-modal-actions">
  {currentEmployee.id ? (
    editMode ? (
      <button onClick={handleUpdate} className="emp-btn">Update</button>
    ) : (
      <button onClick={() => setEditMode(true)} className="emp-btn">Edit</button>
    )
  ) : (
    <button onClick={handleSave} className="emp-btn">Save</button>
  )}
</div>

    </div>
  </div>
)}

    </div>

      
      
              {/* Table */}
      
      
            </div>)}

{activeSection === "clients" && (
  <div className="smm-main">
    <div className="client-container">
      <h2>Manage Clients</h2>
      <table className="client-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Service</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.service}</td>
              <td>{c.status}</td>
              <td>
                {c.isEditing ? (
                  <select
                    value={c.manager || ""}
                    onChange={e => handleManagerChange(c.id, e.target.value)}
                  >
                    <option value="">--None--</option>
                    {managers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                ) : (
                  <span>{c.manager_name || "--None--"}</span>
                )}
              </td>
              <td>
                <button
                  onClick={() => toggleEdit(c.id)}
                  style={{ color: "green", background: "none",fontSize: "20px", border: "none", cursor: "pointer" }}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => viewDetails(c)}
                  style={{ color: "gray", background: "none", border: "none",fontSize: "20px", cursor: "pointer" }}
                >
                  <FaEye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


{activeSection === "reports" && (
  <div className="smm-main">
    <section>
      <h2>Reports</h2>

      {reports.length === 0 ? (
        <p style={{ color: "#888", marginTop: "10px" }}>
          No reports uploaded yet.
        </p>
      ) : (
        <table className="report-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Uploaded At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.name}</td>
                <td>{report.uploadedAt}</td>
                <td>
                  <button
  onClick={() => handleDownloadReport(report.id, report.name)}
  className="btn-download"
>
  Download
</button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  </div>
)}

            {activeSection === "feedback" && (
  <div className="smm-main">
<div className="feedback-container">
  <h2>Manage Feedback</h2>
 <table className="feedback-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Message</th>
      <th>Date</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {feedbacks.length === 0 ? (
      <tr>
        <td colSpan="5">No feedback available</td>
      </tr>
    ) : (
      feedbacks.map(fb => (
        <tr key={fb.id}>
          <td>{fb.name}</td>
          <td>{fb.email}</td>
          <td>{fb.message.length > 30 ? fb.message.slice(0, 30) + "..." : fb.message}</td>
          <td>{fb.date}</td>
          <td>
            <button className="view-btn" onClick={() => setSelectedFeedback(fb)}>View</button>
            <button className="delete-btn" onClick={() => handleDeleteFeedback(fb.id)}>Delete</button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>


  {selectedFeedback && (
    <div className="modal-overlay">
      <div className="feedback-modal modern">
        <span className="close-btn" onClick={() => setSelectedFeedback(null)}>&times;</span>
        <h3>Feedback Details</h3>
        <p><strong>Name:</strong> {selectedFeedback.name}</p>
        <p><strong>Email:</strong> {selectedFeedback.email}</p>
        <p><strong>Date:</strong> {selectedFeedback.date}</p>
        <p><strong>Message:</strong> {selectedFeedback.message}</p>
      </div>
    </div>
  )}
</div>

  </div>
)}



      {activeSection === "analytics" && (
<div className="smm-main">
  <div className="dashboard-container">
      <h2>Analytics</h2>

      {/* Buttons */}
      <div className="tabs">
        <button className={activeTab === 'clients' ? 'active' : ''} onClick={() => setActiveTab('clients')}>Clients</button>
        <button className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}>Employees</button>
      </div>

      {/* Graphs based on selected tab */}
      <div className="charts-section">
        {activeTab === 'clients' && (
          <>
 <div className="smm-main analytics-layout">
   <div className="stats-container">
  <div className="stat-card total-clients">
    <FaUsers className="stat-icon" />
    <div className="stat-content">
      <span className="stat-label">Total Clients</span>
      <span className="stat-value">{summaryData.total_clients ?? 0}</span>
    </div>
  </div>

  <div className="stat-card active-projects">
    <FaTasks className="stat-icon" />
    <div className="stat-content">
      <span className="stat-label">Active Projects</span>
      <span className="stat-value">{summaryData.active_projects ?? 0}</span>
    </div>
  </div>

  <div className="stat-card inactive-projects">
    <FaCheckCircle className="stat-icon" />
    <div className="stat-content">
      <span className="stat-label">Inactive Projects</span>
      <span className="stat-value">{summaryData.inactive_projects ?? 0}</span>
    </div>
  </div>
</div>
 <div className="chart-wrapper">
<div className="chart-box" style={{ display: "flex", alignItems: "center" }}>
  <ResponsiveContainer width="50%" height={300}>
    <PieChart>
      <Pie
        data={pieData}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={90}
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>

  <div style={{ width: "50%", paddingLeft: "20px",marginBottom:'-180px' }}>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {pieData.map((entry, index) => (
        <li
          key={index}
          style={{
            marginBottom: "10px",
            color: COLORS[index % COLORS.length],
            fontWeight: 500,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              backgroundColor: COLORS[index % COLORS.length],
              borderRadius: "50%",
              marginRight: 8,
            }}
          />
          {entry.name}: {entry.value}
        </li>
      ))}
    </ul>
  </div>
</div>

  </div>
</div>
    <div className="table-section">
      <h3>Client Activity</h3>
      <table className="report-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Login Time</th>
            <th>Logout Time</th>
            <th>Service</th>
          </tr>
        </thead>
<tbody>
  {clientActivity.length === 0 ? (
    <tr>
      <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
        No client activity found.
      </td>
    </tr>
  ) : (
    clientActivity.map((client, i) => (
      <tr key={i}>
        <td>{client.email || "N/A"}</td>
        <td>{client.login_time ? new Date(client.login_time).toLocaleString() : "N/A"}</td>
        <td>
          {client.logout_time
            ? new Date(client.logout_time).toLocaleString()
            : "Active"}
        </td>
        <td>{client.service || "N/A"}</td>
      </tr>
    ))
  )}
</tbody>



      </table>
    </div>
          </>
        )}

        {activeTab === 'employees' && (
          <>
<div className="smm-mmain">

<div className="analytics-charts-container">
  {/* Left: Line Chart */}
  <div className="analytics-chart-box">
    <h3>📈 Bookings by Profession</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={bookingData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="profession" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="booking_count"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Right: Pie Chart */}
  <div className="analytics-chart-box">
    <h3>📊 Employees by Profession</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={professionData}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={80}
          
        >
          {professionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="middle" align="right" layout="vertical" />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>




      <div className="chart-boxx">
        <h3>Employee Activity Logs</h3>
        <table className="report-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Profession</th>
              <th>Login Time</th>
              <th>Logout Time</th>
            </tr>
          </thead>
          <tbody>
            {activityLogs.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
                  No activity logs found.
                </td>
              </tr>
            ) : (
              activityLogs.map((log, i) => (
                <tr key={i}>
                  <td>{log.email || "N/A"}</td>
                  <td>{log.profession || "N/A"}</td>
                  <td>{log.login_time ? new Date(log.login_time).toLocaleString() : "N/A"}</td>
                  <td>{log.logout_time ? new Date(log.logout_time).toLocaleString() : "Active"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
          </>
        )}
      </div>

    </div>
      </div>)}

<Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel="Booking Details"
  style={{
    content: {
      maxWidth: '400px',
      margin: 'auto',
      padding: '20px',
      borderRadius: '10px'
    }
  }}
>
  <h2>Booking Details</h2>
  {selectedBooking && (
    <div>
      <p><strong>Booking ID:</strong> {selectedBooking.id}</p>
      <p><strong>Service:</strong> {selectedBooking.service}</p>
      <p><strong>Status:</strong> {selectedBooking.status}</p>
      <p><strong>Client Email:</strong> {selectedBooking.email}</p>
    </div>
  )}
  <button onClick={closeModal} style={{ marginTop: '10px' }}>Close</button>
</Modal>

</div>

);
};


export default Admin;
