import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  FaBars, FaSignOutAlt, FaUser, FaBriefcase, FaDashcube, FaTasks,FaMoneyBill, FaEye
} from "react-icons/fa";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const FinanceManagerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
  const [transactions] = useState([
    { date: '2025-05-01', desc: 'Office Rent', category: 'Fixed Cost', amount: 1200, type: 'debit' },
    { date: '2025-05-02', desc: 'Client Payment', category: 'Income', amount: 5000, type: 'credit' },
    { date: '2025-05-03', desc: 'Utility Bill', category: 'Fixed Cost', amount: 300, type: 'debit' },
    { date: '2025-05-04', desc: 'Software Subscription', category: 'Operational', amount: 150, type: 'debit' },
    { date: '2025-05-05', desc: 'Freelancer Payment', category: 'Payroll', amount: 800, type: 'debit' },
    { date: '2025-05-06', desc: 'Service Income', category: 'Income', amount: 3200, type: 'credit' },
  ]);

  const totalRevenue = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const profit = totalRevenue - totalExpenses;

  const revenueData = {
    labels: transactions.map(t => t.date),
    datasets: [
      {
        label: 'Revenue',
        data: transactions.map(t => t.type === 'credit' ? t.amount : 0),
        borderColor: '#28a745',
        fill: false
      },
      {
        label: 'Expenses',
        data: transactions.map(t => t.type === 'debit' ? t.amount : 0),
        borderColor: '#dc3545',
        fill: false
      }
    ]
  };

  const categoryTotals = {};
  transactions.forEach(t => {
    if (t.type === 'debit') {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    }
  });

  const expensePieData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#8e44ad']
    }]
  };

 const [reports, setReports] = useState(() => {
  const stored = localStorage.getItem("uploadedReports");
  return stored ? JSON.parse(stored) : [];
});
     const [file, setFile] = useState(null);
    

    
    const handleReportUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
    
      const reader = new FileReader();
      reader.onload = () => {
        const newReport = {
          id: Date.now(),
          name: file.name,
          data: reader.result,
          uploadedAt: new Date().toLocaleString(),
        };
    
        const updatedReports = [...reports, newReport];
        setReports(updatedReports);
        localStorage.setItem("uploadedReports", JSON.stringify(updatedReports));
      };
      reader.readAsDataURL(file);
    };
    const handleDeleteReport = (id) => {
      const updatedReports = reports.filter(r => r.id !== id);
      setReports(updatedReports);
      localStorage.setItem("uploadedReports", JSON.stringify(updatedReports));
    };
    
  return (
<div className="smm-dashboard">
     <div className={`smm-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <button className="smm-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FaBars />
        </button>
        <div className="smm-menu">
          <div className={`smm-menu-item ${activeSection === "dashboard" ? "active" : ""}`} onClick={() => setActiveSection("dashboard")}>
            <FaDashcube />
            {isSidebarOpen && <span>Dashboard</span>}
          </div>
          <div className={`smm-menu-item ${activeSection === "transactions" ? "active" : ""}`} onClick={() => setActiveSection("transactions")}>
            <FaMoneyBill/>
            {isSidebarOpen && <span>Transactions</span>}
          </div>
        
         
<div className={`smm-menu-item ${activeSection === "reports" ? "active" : ""}`} onClick={() => setActiveSection("reports")}>
  <FaTasks />
  {isSidebarOpen && <span>Reports</span>}
</div>

          <div className="smm-menu-item logout">
            <FaSignOutAlt />
            {isSidebarOpen && <span>Logout</span>}
          </div>
        </div>
      </div>

     

        {activeSection === 'dashboard' && (
          <>
          <div className="smm-main">
            <div className="fm-cards">
              <div className="fm-card"><h3>Total Revenue</h3><p>₹{totalRevenue.toLocaleString()}</p></div>
              <div className="fm-card"><h3>Total Expenses</h3><p>₹{totalExpenses.toLocaleString()}</p></div>
              <div className="fm-card"><h3>Net Profit</h3><p>₹{profit.toLocaleString()}</p></div>
              <div className="fm-card"><h3>Invoices Due</h3><p>₹2,500</p></div>
            </div>

            <div className="fm-charts">
              <div className="fm-chart"><h3>Revenue vs Expenses</h3><Line data={revenueData} /></div>
              <div className="fm-chart"><h3>Expense Categories</h3><Pie data={expensePieData} /></div>
            </div>
            </div>
          </>
        )}

        {activeSection === 'transactions' && (
            <div className="smm-main">
          <div className="fm-table-section">
            <h3>Recent Transactions</h3>
            <table className="fm-table">
              <thead>
                <tr>
                  <th>Date</th><th>Description</th><th>Category</th><th>Amount (₹)</th><th>Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, idx) => (
                  <tr key={idx}>
                    <td>{t.date}</td>
                    <td>{t.desc}</td>
                    <td>{t.category}</td>
                    <td>{t.amount.toLocaleString()}</td>
                    <td style={{ color: t.type === 'credit' ? 'green' : 'red' }}>{t.type}</td>
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
  {reports.length > 0 ? (
    reports.map((report) => (
      <tr key={report.id}>
        <td>{report.name}</td>
        <td>{report.uploadedAt}</td>
        <td>
          <a href={report.data} download={report.name} className="btn-download">Download</a>
          <button onClick={() => handleDeleteReport(report.id)} className="btn-delete">Delete</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" style={{ textAlign: "center", padding: "20px", color: "#777" }}>
        No reports uploaded yet.
      </td>
    </tr>
  )}
</tbody>

    </table>
  )}
</section>

          </div>
        )}
      

        {activeSection === 'budgets' && (
            <div className="smm-main">
          <div className="fm-table-section">
            <h3>Budgets Section</h3>
            <p>Budget planning interface goes here.</p>
          </div>
          </div>
        )}

        {activeSection === 'invoices' && (
            <div className="smm-main">
          <div className="fm-table-section">
            <h3>Invoices Section</h3>
            <p>Invoice management interface goes here.</p>
          </div>
          </div>
        )}
      </div>
    
  );
};

export default FinanceManagerDashboard;
