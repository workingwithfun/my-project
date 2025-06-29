import React, { useState, useEffect, useContext } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./style.css";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import {
  FaBars, FaSignOutAlt, FaClipboardList, FaFileUpload, FaChartBar, FaEye
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";



function EmployeeDashboard() {
    const navigate = useNavigate();
     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [assignments, setAssignments] = useState([]);
const { logout } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("analytics");

//analytics
const [barData, setBarData] = useState([]);
const [pieData, setPieData] = useState([]);
useEffect(() => {
  const token = localStorage.getItem("access_token"); // or sessionStorage, depending on your auth

  axios.get("http://localhost:8000/api/analytics/employee-summary/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((res) => {
    setBarData(res.data.bar_data);
    setPieData(res.data.pie_data);
  })
  .catch((err) => {
    console.error("Analytics fetch error:", err);
  });
}, []);
const COLORS = ["#4caf50", "#f44336"];
const token = localStorage.getItem("access_token");
const decoded = jwtDecode(token);
const loggedInUserId = decoded.user_id; // or `decoded.id` depending on backend

  const [file, setFile] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(stored);
  }, []);


const [reports, setReports] = useState([]);
useEffect(() => {
  fetchReports();
}, []);

const fetchReports = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/reports/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    setReports(response.data);
  } catch (error) {
    console.error("Failed to fetch reports", error);
  }
};
const handleReportUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", file.name);

  try {
await axios.post(
  'http://localhost:8000/api/reports/upload/',
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }
);

    fetchReports(); // Refresh
    toast.success("Report uploaded successfully");
  } catch (error) {
    console.error("Upload failed", error);
    toast.error("Upload failed");
  }
};
const handleDeleteReport = async (id) => {
  try {
    await axios.delete(`http://localhost:8000/api/reports/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    fetchReports(); // Refresh
    toast.success("Report deleted successfully");
  } catch (error) {
    console.error("Delete failed", error);
    toast.error("Delete failed")
  }
};


const [completed, setCompleted] = useState(() => {
  const stored = localStorage.getItem("completedAssignments");
  return stored ? JSON.parse(stored) : [];
});


const markCompleted = (bookingId) => {
  if (!completed.includes(bookingId)) {
    const updated = [...completed, bookingId];
    setCompleted(updated);
    localStorage.setItem("completedAssignments", JSON.stringify(updated));
  }
};

//Assignment

useEffect(() => {
  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get("http://localhost:8000/api/assigned-bookings/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssignments(res.data); // ✅ store fetched bookings
    } catch (err) {
      console.error("Failed to fetch assigned bookings:", err);
    }
  };

  fetchAssignments();
}, []);


const [filters, setFilters] = useState({});
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 5;

// Apply filters
const filteredAssignments = assignments.filter((booking) => {
  const dateMatch = !filters.date || booking.date?.includes(filters.date);
  const locationMatch = !filters.location || booking.address?.toLowerCase().includes(filters.location.toLowerCase());
  const hoursMatch = !filters.hours || booking.hours === Number(filters.hours);
  return dateMatch && locationMatch && hoursMatch;
});


// Sort or paginate if needed
const sortedAssignments = [...filteredAssignments].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

const paginatedAssignments = sortedAssignments.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

  const handleLogout = () => {
    logout();            // Clears token
    navigate("/");       // Navigate to home after logout
  };

  const [clientStats, setClientStats] = useState(null);
const [employeeStats, setEmployeeStats] = useState([]);

// analytics

useEffect(() => {
  if (activeSection === "analytics") {
    fetchEmployeeStats();
  }
}, [activeSection]);

const fetchEmployeeStats = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/analytics/task-summary/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    setBarData(res.data.bar_data || []);
    setPieData(res.data.pie_data || []);
  } catch (err) {
    console.error("Failed to fetch employee stats", err);
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
          <div className={`smm-menu-item ${activeSection === "analytics" ? "active" : ""}`} onClick={() => setActiveSection("analytics")}>
            <FaChartBar />
            {isSidebarOpen && <span> Analytics</span>}
          </div>
          <div className={`smm-menu-item ${activeSection === "assignments" ? "active" : ""}`} onClick={() => setActiveSection("assignments")}>
            <FaClipboardList />
            {isSidebarOpen && <span>Assigned Bookings</span>}
            
          </div>
        
         
<div className={`smm-menu-item ${activeSection === "reports" ? "active" : ""}`} onClick={() => setActiveSection("reports")}>
  <FaFileUpload />
    {isSidebarOpen && <span>Upload Reports</span>}
</div>
 

          <div className="smm-menu-item logout" onClick={handleLogout}>
            <FaSignOutAlt />
            {isSidebarOpen && <span>Logout</span>}
          </div>
        </div>
      </div>

{activeSection === "analytics" && (
  <div className="smm-main">
    <section>
      <h2>Analytics</h2>
      <div className="charts" style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        {/* Work Over Time (Bar Chart) */}
        <div className="chart-box" style={{ width: "48%" }}>
          <h3>Work Over Time</h3>
          {Array.isArray(barData) && barData.length > 0 ? (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={barData}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="works" fill="#2196f3" />
    </BarChart>
  </ResponsiveContainer>
) : (
  <p style={{ color: "#888", textAlign: "center" }}>No work data available</p>
)}

        </div>

        {/* Work Status (Pie Chart) */}
        <div className="chart-box" style={{ width: "48%" }}>
          <h3>Work Status</h3>
          {Array.isArray(pieData) && pieData.length > 0 ? (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={pieData}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {pieData.map((entry, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
) : (
  <p style={{ color: "#888", textAlign: "center" }}>No status data available</p>
)}

        </div>
      </div>
    </section>
  </div>
)}


        {activeSection === "assignments" && (
             <div className="smm-main">
<section>
  <h2>Assigned Bookings</h2>

  <div className="filters">
    <input type="date" onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
    <input
      type="text"
      placeholder="Location"
      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
    />
    <input
      type="number"
      placeholder="Hours"
      onChange={(e) => setFilters({ ...filters, hours: e.target.value })}
    />
  </div>

  <table className="assignment-table">
    <thead>
      <tr>
        <th>Booking ID</th>
        <th>Date of Service</th>
        <th>Location</th>
        <th>Hours</th>
        <th>Action</th>
      </tr>
    </thead>
<tbody>
  {paginatedAssignments.length === 0 ? (
    <tr>
      <td colSpan="5" style={{ textAlign: "center", color: "#888", padding: "20px" }}>
        No assignments found for the selected filters.
      </td>
    </tr>
  ) : (
    paginatedAssignments.map((booking) => {
      const isCompleted = completed.includes(booking.id);

      return (
        <tr key={booking.id} className={isCompleted ? "completed-row" : ""}>
          <td>{booking.id}</td>
          <td>{booking.date}</td>
          <td>{booking.address}</td>
          <td>{booking.hours}</td>
          <td>
            {isCompleted ? (
              <span style={{ fontWeight: "bold", color: "green" }}>✔ Completed</span>
            ) : (
              <input
                type="checkbox"
                onChange={() => markCompleted(booking.id)}
              />
            )}
          </td>
        </tr>
      );
    })
  )}
</tbody>



  </table>

  <div className="pagination">
    {Array.from({ length: Math.ceil(sortedAssignments.length / pageSize) }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => setCurrentPage(i + 1)}
        className={currentPage === i + 1 ? "active" : ""}
      >
        {i + 1}
      </button>
    ))}
  </div>
</section>

          </div>
        )}

        {activeSection === "reports" && (
             <div className="smm-main">
          <section>
  <h2>Upload Reports</h2>
  <input
  type="file"
  id="reportUpload"
  onChange={handleReportUpload}
  style={{ display: "none" }}
/>
<button onClick={() => document.getElementById("reportUpload").click()} className="btn-upload">
  Upload Report
</button>

  {reports.length === 0 ? (
    <p style={{ color: "#888", marginTop: "10px" }}>No reports uploaded yet.</p>
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
              <a href={report.data} download={report.name} className="btn-download">Download</a>
              <button onClick={() => handleDeleteReport(report.id)} className="btn-delete">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</section>

          </div>
        )}
      
    </div>
 
  );
}

export default EmployeeDashboard;
