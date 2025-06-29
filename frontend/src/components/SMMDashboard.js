import React, { useState, useEffect } from "react";
import {
  FaBars, FaSignOutAlt, FaUser, FaBriefcase,FaFileUpload, FaClock, FaTasks, FaChartBar, FaEye
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { subDays } from "date-fns";
import axios from "axios";
import "./style.css";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {  BarChart, Bar,} from 'recharts';

import { Dialog } from '@headlessui/react';
import html2pdf from 'html2pdf.js';
import { FaFilePdf, FaDownload, FaTimes } from "react-icons/fa";
import jsPDF from "jspdf";
import ReactToPrint from 'react-to-print';
import { useRef } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
const statuses = [
  "Service Booked",
  "Service Under Review",
  "Quotation sent by YGP",
  "Quotation approved by customer",
  "Payment request to customer",
  "Payment received",
  "Under Fulfillment",
  "Delivered",
];

const statusColors = {
  'Service Booked': '#8884d8',
  'Service Under Review': '#ffbb28',
  'Quotation sent by YGP': '#00C49F',
  'Quotation approved by customer': '#FF8042',
  'Payment request to customer': '#FF6666',
  'Payment received': '#82ca9d',
  'Under Fulfillment': '#888888',
  'Delivered': '#0088FE',
};

const bookingsData = [
  { id: '#101', number:"9039495969", service: 'Photography', status: 'Service Booked', date: '2025-04-17' },
  { id: '#102',number:"9039495969", service: 'Videography', status: 'Quotation sent by YGP', date: '2025-04-12' },
  { id: '#103',number:"9039495969", service: 'Photoediting', status: 'Payment received', date: '2025-04-15' },
  { id: '#104',number:"9039495969", service: 'Videoediting', status: 'Delivered', date: '2025-04-14' },
  { id: '#105',number:"9039495969", service: 'Graphic Designing', status: 'Service Under Review', date: '2025-04-13' },
  { id: '#106',number:"9039495969", service: 'Photography', status: 'Payment request to customer', date: '2025-04-16' },
  { id: '#107',number:"9039495969", service: 'Videography', status: 'Quotation approved by customer', date: '2025-04-10' },
  { id: '#108',number:"9039495969", service: 'Photoediting', status: 'Under Fulfillment', date: '2025-04-14' },
  { id: '#109',number:"9039495969", service: 'Videoediting', status: 'Service Under Review', date: '2025-04-11' },
  { id: '#110',number:"9039495969", service: 'Photography', status: 'Payment received', date: '2025-04-09' },
  { id: '#111',number:"9039495969", service: 'Videography', status: 'Delivered', date: '2025-04-07' },
  { id: '#112',number:"9039495969", service: 'Photoediting', status: 'Service Booked', date: '2025-04-16' },
  { id: '#113',number:"9039495969", service: 'Videoediting', status: 'Quotation sent by YGP', date: '2025-04-18' },
  { id: '#114',number:"9039495969", service: 'Graphic Designing', status: 'Payment request to customer', date: '2025-04-13' },
  { id: '#115',number:"9039495969", service: 'Photography', status: 'Quotation approved by customer', date: '2025-04-08' },
  { id: '#116',number:"9039495969", service: 'Videography', status: 'Service Under Review', date: '2025-04-17' },
  { id: '#117',number:"9039495969", service: 'Photoediting', status: 'Payment received', date: '2025-04-06' },
  { id: '#118',number:"9039495969", service: 'Videoediting', status: 'Under Fulfillment', date: '2025-04-02' },
  { id: '#119',number:"9039495969", service: 'Graphic Designing', status: 'Delivered', date: '2025-04-05' },
  { id: '#120',number:"9039495969", service: 'Photography', status: 'Quotation sent by YGP', date: '2025-04-04' },
];
const ITEMS_PER_PAGE = 10;




const SMMDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [employeeFilters, setEmployeeFilters] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 8;
  const [employeesList, setEmployeesList] = useState([]);
const { logout } = useContext(AuthContext);
  const [quotationDetails, setQuotationDetails] = useState(null);
  const generateRandomStartDate = () => {
    const start = new Date(2025, 3, 1);
    const end = new Date(2025, 3, 20);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
      .toISOString()
      .split('T')[0];
  };
const [reports, setReports] = useState(() => {
  const stored = localStorage.getItem("uploadedReports");
  return stored ? JSON.parse(stored) : [];
});

const [selectedBooking, setSelectedBooking] = useState(null);
const [showQuotationModal, setShowQuotationModal] = useState(false);


  const initialData = [...Array(20).keys()].map((_, i) => ({
    id: `#${101 + i}`,
    number: ' 9039495969',
    service: ['Photography', 'Videography', 'Photoediting', 'Videoediting', 'Graphic Designing'][i % 5],
    status: [
      'Service Booked',
      'Quotation sent by YGP',
      'Payment received',
      'Delivered',
      'Service Under Review',
      'Payment request to customer',
      'Quotation approved by customer',
      'Under Fulfillment'
    ][i % 8],
    date: generateRandomStartDate(),
    assignedTo: [],
  }));
 const [data, setData] = useState(initialData);
 const [filterService, setFilterService] = useState('');


  const [editIndex, setEditIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [employeeFilter, setEmployeeFilter] = useState('All');

  const pageSize = 8;
  const [showModal, setShowModal] = useState(false);

  const [filterDate, setFilterDate] = useState(null);
    const filteredData = data.filter((item) =>
    (!filterService || item.service === filterService) &&
    (!filterDate || item.date === filterDate)
  );

const handleOpenModal = (booking) => {
  setSelectedBooking(booking);
  setShowModal(true);
};

const handleCloseModal = () => {
  setShowModal(false);
  setSelectedBooking(null);
};

{/*Tasks*/}
  
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

const [paginatData, setPaginatData] = useState([]);
  const toggleEmployeeAssignment = (name) => {
    const newData = [...data];
    const entry = newData[editIndex];
    const assigned = entry.assignedTo;
    if (assigned.includes(name)) {
      entry.assignedTo = assigned.filter((n) => n !== name);
    } else {
      entry.assignedTo = [...assigned, name];
    }
    setData(newData);
  };

  const deleteEntry = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('client');
  const [filterStatus, setFilterStatus] = useState('All');
 
  const filteredBookings = bookings
    .filter(b => filterStatus === 'All' || b.status === filterStatus)
    .filter(b => !filterDate || new Date(b.date).toDateString() === filterDate.toDateString())
    .sort((a, b) => new Date(b.date) - new Date(a.date));

    const statusCountData = statuses.map(status => {
      const count = filteredBookings.filter(b => b.status === status).length;
      return { name: status, value: count };
    });
    const printRef = useRef();

    const bookingsPerDate = {};
    filteredBookings.forEach(b => {
      bookingsPerDate[b.date] = (bookingsPerDate[b.date] || 0) + 1;
    });
    const lineChartData = Object.keys(bookingsPerDate).map(date => ({
      date,
      bookings: bookingsPerDate[date],
    }));
    


  // Calculate the index of the first and last item on the current page
  const lastIndex = currentPage * ITEMS_PER_PAGE;
  const firstIndex = lastIndex - ITEMS_PER_PAGE;

  // Get the data for the current page
  const currentData = filteredBookings.slice(firstIndex, lastIndex);


  // Calculate the total number of pages
  const totalPages = Math.ceil(bookingsData.length / ITEMS_PER_PAGE);

  // Handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [quotationViewed, setQuotationViewed] = useState(false);
  const [paymentRequested, setPaymentRequested] = useState(false);
  const [filterData, setFilterData] = useState([]);
  useEffect(() => {
    let updatedData = [...data];
  
    if (filterService) {
      updatedData = updatedData.filter(item => item.service === filterService);
    }
  
    if (filterDate) {
      updatedData = updatedData.filter(item => item.date === filterDate);
    }
  
    setFilterData(updatedData);
  }, [filterService, filterDate, data]);
  

const handleView = (booking) => {
  setSelectedBooking(booking); // stores the booking object or just the ID
  setReadonly(true);
  setFormChanged(false);
  setQuotationGenerated(false);
  setQuotationViewed(false);
  setPaymentRequested(false);
  setShowModal(true); // this will trigger the useEffect to fetch booking details
};

const viewQuotation = () => {
  if (quotation) {
    setShowQuotationModal(true);
  } else {
    toast.warning("No quotation available");
  }
};


  const handleRequestPayment = () => setPaymentRequested(true);
  const handleAssignTask = () => alert('Task assigned!');

  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => !isReadonly && handleChange('rating', i)}
          style={{
            cursor: isReadonly ? 'default' : 'pointer',
            color: formData.rating >= i ? '#ffc107' : '#ccc',
            fontSize: '20px',
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const itemsPerPage = 10;
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

const [projectData, setProjectData] = useState([]);

// Run when bookings change
useEffect(() => {
  const completed = bookings.filter(b => b.status === "Delivered").length;
  const pending = bookings.filter(b => b.status !== "Delivered").length;

  setProjectData([
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ]);
}, [bookings]); // <- Only re-run this when `bookings` changes



// Add this to your useState list:
const [startTime, setStartTime] = useState({ hour: '', minute: '', meridian: 'AM' });
const [endTime, setEndTime] = useState({ hour: '', minute: '', meridian: 'AM' });
const [bookingHours, setBookingHours] = useState(0);
const [totalCost, setTotalCost] = useState(0);

const costPerHour = 1000;

// Time conversion helper
const convertToMinutes = ({ hour, minute, meridian }) => {
  let h = parseInt(hour);
  const m = parseInt(minute);
  if (meridian === 'PM' && h !== 12) h += 12;
  if (meridian === 'AM' && h === 12) h = 0;
  return h * 60 + m;
};

// Calculate booking hours and cost
const calculateBookingDetails = () => {
  const start = convertToMinutes(startTime);
  const end = convertToMinutes(endTime);
  if (start >= 0 && end > start) {
    const diffMinutes = end - start;
    const hours = diffMinutes / 60;
    setBookingHours(hours);
    setTotalCost(hours * costPerHour);
  } else {
    setBookingHours(0);
    setTotalCost(0);
  }
};



// Whenever time changes
useEffect(() => {
  calculateBookingDetails();
}, [startTime, endTime]);

// Time Picker JSX
const renderTimePicker = (label, time, setTime, disabled) => (
  <div className="form-group time-picker">
    <label>{label}</label>
    <div style={{ display: 'flex', gap: '8px' }}>
      <select
        value={time.hour}
        disabled={disabled}
        onChange={(e) => setTime({ ...time, hour: e.target.value })}
      >
        <option value="">Hr</option>
        {[...Array(12)].map((_, i) => (
          <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
        ))}
      </select>

      <select
        value={time.minute}
        disabled={disabled}
        onChange={(e) => setTime({ ...time, minute: e.target.value })}
      >
        <option value="">Min</option>
        {['00', '15', '30', '45'].map((min) => (
          <option key={min} value={min}>{min}</option>
        ))}
      </select>

      <select
        value={time.meridian}
        disabled={disabled}
        onChange={(e) => setTime({ ...time, meridian: e.target.value })}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  </div>
);

const handleGenerateQuotation = () => {
  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = formatTime(endTime);

  const data = {
    bookingId: formData.bookingId || '',
    date: formData.date || '',
    service: formData.service || '',
    startTime: to24HourFormat,
    endTime: formattedEndTime,
    bookingHours: bookingHours || 0,
    totalCost: totalCost || 0,
    people: formData.people || 1,
    address: formData.address || '',
    phone: formData.phone || '',
    email: formData.email || '',
    instructions: formData.instructions || '',
  };

  setQuotationDetails(data);
  setQuotationGenerated(true);
  toast.success("Quotation generated successfully");
};

const formatTime = (time) => {
 if (!time || time.hour === '' || time.minute === '' || !time.meridian) return 'N/A';
  const hour = parseInt(time.hour);
  const minute = parseInt(time.minute);
const period = time.meridian.toUpperCase();

  if (isNaN(hour) || isNaN(minute)) return 'N/A';
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
};


const QuotationTemplate = React.forwardRef((props, ref) => {
  const data = quotationDetails;

  return (
    <div ref={ref} className="quotation-template">
      <h2>Service Quotation</h2>
      <p><strong>Booking ID:</strong> {data.bookingId}</p>
      <p><strong>Date of Service:</strong> {data.date}</p>
      <p><strong>Service:</strong> {data.service}</p>
      <p><strong>Start Time:</strong> {data.startTime}</p>
      <p><strong>End Time:</strong> {data.endTime}</p>
      <p><strong>Total Booking Hours:</strong> {data.bookingHours} hour(s)</p>
      <p><strong>Total Cost:</strong> ₹{data.totalCost}</p>
      <p><strong>People:</strong> {data.people}</p>
      <p><strong>Address:</strong> {data.address}</p>
      <p><strong>Phone:</strong> {data.phone}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Instructions:</strong> {data.instructions || 'N/A'}</p>
      <hr />
      <p>Thank you for choosing our service!</p>
    </div>
  );
});

const closeModal = () => {
  setSelectedBooking(null);
  setShowModal(false);
};


const handleDelete = (id) => {
  setBookings(prev => prev.filter(b => b.id !== id));
};

// FILTERING
const filterBookings = bookings.filter(b => {
  const serviceMatch = serviceFilter === 'All' || b.service === serviceFilter;
  const dateMatch = dateFilter === '' || b.date === dateFilter;
  return serviceMatch && dateMatch;
});

// PAGINATION LOGIC


const indexOfLastBooking = currentPage * bookingsPerPage;
const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
const currentBookings = filterBookings.slice(indexOfFirstBooking, indexOfLastBooking);

const totalPage = Math.ceil(filterBookings.length / bookingsPerPage);

// Pagination: Logic to display the current page and navigate

  const [activeTab, setActiveTab] = useState('clients');
  const [uploadedReports, setUploadedReports] = useState([]);
  const [filters, setFilters] = useState('15days');

  const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedReports(prev => [...prev, file.name]);
      alert(`Uploaded: ${file.name}`);
    }
  };

  // Filter bookings data based on date (simplified)
  const filData = bookingsData; // (You can implement date filtering later)

  // Clients graphs data
  const servicesCount = filData.reduce((acc, item) => {
    acc[item.service] = (acc[item.service] || 0) + 1;
    return acc;
  }, {});

  const statusCount = filData.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  
const [employeeAssignments, setEmployeeAssignments] = useState([]);
const [employeePieData, setEmployeePieData] = useState([]);

useEffect(() => {
  if (!bookings?.length) return;

  const counts = {
    Photography: 0,
    Videography: 0,
    'Photo Editing': 0,
    'Video Editing': 0,
    'Graphic Designing': 0,
  };

  bookings.forEach(booking => {
    const assigned = booking.task?.assigned_employees || [];
    assigned.forEach(emp => {
      const prof = emp.profession?.toLowerCase();
      switch (prof) {
        case 'photographer':
          counts.Photography += 1;
          break;
        case 'videographer':
          counts.Videography += 1;
          break;
        case 'photo editor':
          counts['Photo Editing'] += 1;
          break;
        case 'video editor':
          counts['Video Editing'] += 1;
          break;
        case 'graphic designer':
          counts['Graphic Designing'] += 1;
          break;
        default:
          break;
      }
    });
  });

  const lineData = Object.entries(counts).map(([name, assignments]) => ({
    name,
    assignments,
  }));

  setEmployeeAssignments(lineData);
}, [bookings]);

useEffect(() => {
  if (!employeesList?.length) return;

  const counts = {
    Photography: 0,
    Videography: 0,
    'Photo Editing': 0,
    'Video Editing': 0,
    'Graphic Designing': 0,
  };

  employeesList.forEach(emp => {
    const prof = emp.profession?.toLowerCase();
    switch (prof) {
      case 'photographer':
        counts.Photography += 1;
        break;
      case 'videographer':
        counts.Videography += 1;
        break;
      case 'photo editor':
        counts['Photo Editing'] += 1;
        break;
      case 'video editor':
        counts['Video Editing'] += 1;
        break;
      case 'graphic designer':
        counts['Graphic Designing'] += 1;
        break;
      default:
        break;
    }
  });

  const pieData = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));

  setEmployeePieData(pieData);
}, [employeesList]);


  const [showCustomDate, setShowCustomDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  const applyFilter = (type) => {
    setFilters(type);
    setShowCustomDate(false);
    const now = new Date();
    if (type === '15days') {
      filterDatas(new Date(now.setDate(now.getDate() - 15)), new Date());
    } else if (type === '30days') {
      filterDatas(new Date(now.setDate(now.getDate() - 30)), new Date());
    }
  };
  
  const applyCustomDateRange = (start, end) => {
    if (start && end) {
      filterDatas(start, end);
    }
  };
  
  const filterDatas = (start, end) => {
    // Filter your data (e.g., bookingsData) based on the start and end dates
    const filtered = bookingsData.filter(item => {
      const date = new Date(item.date);
      return date >= start && date <= end;
    });
    // Update your serviceData/statusCountData/etc here based on `filtered`
  };

//convert time
const to24HourFormat = ({ hour, minute, meridian }) => {
  let h = parseInt(hour, 10);
  if (meridian === 'PM' && h !== 12) h += 12;
  if (meridian === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${minute}:00`; // e.g. 13:15:00
};

//fetch
const bookingId = selectedBooking?.id;

const fetchBookings = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/bookings/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    setBookings(response.data);
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
};


  

useEffect(() => {
  fetchBookings();
}, []);
  

const handleStatusChange = async (bookingId, newStatus) => {
   setBookings(prev =>
      prev.map(b => (b.bookingId === bookingId ? { ...b, status: newStatus } : b))
    );
  try {
    const token = localStorage.getItem("access_token");

    await axios.patch(
      `http://localhost:8000/api/bookings/${bookingId}/`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Status updated");
   fetchBookings();
    // Optionally refetch data or update state
  } catch (error) {
    console.error("Failed to update status", error);
    toast.error("Could not update status");
  }
};

//quotation
// Create service count data
const serviceCounts = {};
filteredBookings.forEach(booking => {
  const service = booking.service || "Unknown";
  serviceCounts[service] = (serviceCounts[service] || 0) + 1;
});

// Convert to chart format
const barData = Object.entries(serviceCounts).map(([name, value]) => ({
  name,
  value,
}));


const [formData, setFormData] = useState({});
  const [isReadonly, setReadonly] = useState(true);
  const [formChanged, setFormChanged] = useState(false);
  const [quotation, setQuotation] = useState(null);
  const [quotationGenerated, setQuotationGenerated] = useState(false);


  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormChanged(true);
    setQuotationGenerated(true);
  };

  const handleEdit = () => setReadonly(false);

const handleSave = async () => {
  try {
    const token = localStorage.getItem('access_token');

    // Validate time fields
    if (!startTime.hour || !startTime.minute || !startTime.meridian ||
        !endTime.hour || !endTime.minute || !endTime.meridian) {
      toast.error('Please fill both start and end times');
      return;
    }

    const formattedStartTime = to24HourFormat(startTime); // "HH:MM:00"
    const formattedEndTime = to24HourFormat(endTime);

    const updatedFormData = {
      ...formData,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      date: formData.date?.split('T')[0],
      total_cost: Number(totalCost) || 0, // YYYY-MM-DD
    };

    await axios.patch(
      `http://localhost:8000/api/bookings/${bookingId}/`,
      updatedFormData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success('Saved');
    setReadonly(true);
    setFormChanged(false);
    setQuotationGenerated(true); 

  } catch (err) {
    console.error("PATCH failed:", err.response?.data || err);
    toast.error('Could not save');
  }
};



const generateQuotation = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const { data } = await axios.post(
      `http://localhost:8000/api/generate-quotation/${bookingId}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setFormData(data);
    setQuotation(data.quotation);
    setQuotationGenerated(true);
    toast.success('Quotation generated');
  } catch {
    toast.error('Error generating quotation');
  }
};

const downloadPDF = () => {
  const doc = new jsPDF();
  doc.setFont("courier", "normal");
  doc.setFontSize(12);
  doc.text(quotation || "No quotation available", 10, 10);
  doc.save(`quotation-${bookingId}.pdf`);
};

useEffect(() => {
  if (!showModal || !bookingId) return;

  const fetchBooking = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/bookings/${bookingId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const parsedDate = data.date?.split('T')[0] || "";
      setFormData({ ...data, date: parsedDate });
      setQuotation(data.quotation_text || "");
      setQuotationGenerated(!!data.quotation_text);
      setFormChanged(false);
      setReadonly(true);

      // Parse start time (normalize hour)
      if (data.start_time) {
        const [hourMin, meridian] = data.start_time.split(" ");
        let [hour, minute] = hourMin.split(":");
        hour = String(parseInt(hour, 10)); // Remove leading zero
        setStartTime({ hour, minute, meridian });
      }

      // Parse end time (normalize hour)
        if (data.start_time) {
        const [hourMin, meridian] = data.start_time.split(" ");
        let [hour, minute] = hourMin.split(":");
        hour = String(parseInt(hour, 10)); // Remove leading zero
        setStartTime({ hour, minute, meridian });
      }

      // Parse end time (normalize hour)
     if (data.end_time) {
  const parts = data.end_time.split(" ");
  const timePart = parts[0]; // always present
  const meridian = parts[1] || ""; // may be missing (e.g., in 24-hour format)

  let [hour, minute] = timePart.split(":");
  hour = String(parseInt(hour, 10)); // Remove leading zero

  setEndTime({ hour, minute, meridian });
}



    } catch (err) {
      console.error("Error fetching booking", err);
    }
  };

  fetchBooking();
}, [showModal, bookingId]);

const fetchEmployees = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const { data } = await axios.get("http://localhost:8000/api/employees/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setEmployeesList(data);  // ✅ No need to filter here if backend does it
  } catch (err) {
    console.error("Failed to fetch employees:", err);
  }
};



const handleAssign = async () => {
  try {
    const token = localStorage.getItem("access_token");

    await axios.patch(
      `http://localhost:8000/api/bookings/${selectedBooking.id}/`,
      {
        assigned_employee_ids: selectedBooking.assignedEmployeeIds || [],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update the local bookings state after assignment
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              assignedTo: employeesList
                .filter((emp) =>
                  (selectedBooking.assignedEmployeeIds || []).includes(emp.id)
                )
                .map((e) => e.name),
              assignedToIds: selectedBooking.assignedEmployeeIds || [],
            }
          : b
      )
    );
   toast.success("Employees assigned successfully!");
    closeModal();
    fetchBookings();  
  } catch (err) {
    console.error("Error assigning employees:", err);
    toast.error("Failed to assign employees.");
  }
};

const toggleEmployee = (empId) => {
  setSelectedBooking((prev) => {
    const current = prev.assignedEmployeeIds || [];
    const updated = current.includes(empId)
      ? current.filter((id) => id !== empId)
      : [...current, empId];

    return { ...prev, assignedEmployeeIds: updated };
  });
};

const openModal = async (booking) => {
  if (!booking) {
    console.error("No booking provided to openModal.");
    return;
  }

  setSelectedBooking({
    ...booking,
    assignedEmployeeIds: Array.isArray(booking.assigned_employee_ids)
      ? booking.assigned_employee_ids
      : [],
  });

  try {
    const token = localStorage.getItem("access_token");
    const res = await axios.get("http://localhost:8000/api/employees/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const filtered = res.data.filter(
  (emp) =>
    !["admin", "social media manager", "finance manager"].includes(
      emp.profession?.toLowerCase()
    )
);


    setEmployeesList(filtered);
    setShowModal(true);
  } catch (error) {
    console.error("Failed to fetch employees:", error);
  }
};


//reports
const handleReportUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const token = localStorage.getItem("access_token");
    await axios.post("http://localhost:8000/api/reports/upload/", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    fetchReports(); // Refresh after upload
    toast.success("Report uploaded successfully!");
  } catch (error) {
    console.error("Upload failed", error);
    toast.error("Upload failed");
  }
};

const fetchReports = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const { data } = await axios.get("http://localhost:8000/api/reports/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReports(data);
  } catch (error) {
    console.error("Failed to fetch reports", error);
  }
};

useEffect(() => {
  fetchReports();
}, []);

const handleDeleteReport = async (reportId) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.delete(`http://localhost:8000/api/reports/${reportId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReports();
  } catch (error) {
    console.error("Failed to delete report", error);
  }
};

  const handleLogout = () => {
    logout();            // Clears token
    navigate("/");       // Navigate to home after logout
  };

  return (

    <div className="smm-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Sidebar */}
      <div className={`smm-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <button className="smm-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FaBars />
        </button>
        <div className="smm-menu">
          <div className={`smm-menu-item ${activeSection === "client" ? "active" : ""}`} onClick={() => setActiveSection("client")}>
            <FaUser />
            {isSidebarOpen && <span>Client Management</span>}
          </div>
          <div className={`smm-menu-item ${activeSection === "project" ? "active" : ""}`} onClick={() => setActiveSection("project")}>
            <FaBriefcase />
            {isSidebarOpen && <span>Projects</span>}
          </div>
        
          <div className={`smm-menu-item ${activeSection === "task" ? "active" : ""}`} onClick={() => setActiveSection("task")}>

            <FaTasks />
            {isSidebarOpen && <span>Task Management</span>}
          </div>
                  
                   
          <div className={`smm-menu-item ${activeSection === "reports" ? "active" : ""}`} onClick={() => setActiveSection("reports")}>
            <FaFileUpload />
              {isSidebarOpen && <span>Upload Reports</span>}
          </div>
           
          
          <div className={`smm-menu-item ${activeSection === "analytics" ? "active" : ""}`} onClick={() => setActiveSection("analytics")}>
            <FaChartBar />
            {isSidebarOpen && <span>Analytics</span>}
          </div>
          <div className="smm-menu-item logout" onClick={handleLogout}>
            <FaSignOutAlt />
            {isSidebarOpen && <span>Logout</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeSection === "client" && (
      <div className="smm-main">
        <h2>Client Management</h2>

        <div className="smm-filters">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            {statuses.map((status, idx) => (
              <option key={idx} value={status}>{status}</option>
            ))}
          </select>

          <DatePicker
            selected={filterDate}
            onChange={(date) => setFilterDate(date)}
            placeholderText="Filter by date"
            className="form-control"
          />
        </div>
        <div className="smm-analytics">
        <div className="analytics-charts">
  <div className="chart-box">
    <h4>Bookings Over Time</h4>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={lineChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="bookings" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div className="chart-box">
    <h4>Bookings by Status</h4>
    <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={statusCountData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      // Removed label prop here
    >
      {statusCountData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={statusColors[entry.name] || '#ccc'} />
      ))}
    </Pie>
    <Tooltip />
    <Legend layout="vertical" align="right" verticalAlign="middle" />
  </PieChart>
</ResponsiveContainer>

  </div>
</div>

</div>


        {/* Table */}
<table className="smm-table">
  <thead>
    <tr>
      <th>Booking ID</th>
      <th>Phone Number</th>
      <th>Service</th>
      <th>Status</th>
      <th>Booking Date</th>
      <th>Update</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {currentData.length === 0 ? (
      <tr>
        <td colSpan="6" className="text-center">No bookings found</td>
      </tr>
    ) : (
      bookings.map((b) => (
        <tr key={b.id}>
          <td>{b.id}</td>
          <td>{b.phone}</td>
          <td>{b.service}</td>
          <td><span className={`badge ${getBadgeClass(b.status)}`}>{b.status}</span></td>
                  
          <td>{b.date_only}</td>
          <td>
                    <select value={b.status} onChange={(e) => handleStatusChange(b.id, e.target.value)}>
                      {statuses.map((status, i) => (
                        <option key={i} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
          <td>
            <button className="smm-view-btn" onClick={() => handleOpenModal(b)}>
              <FaEye /> View
            </button>
          </td>
        </tr>
      ))
)}
  </tbody>
</table>

{/* Pagination */}
<div className="pagination">
  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index + 1}
      className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
      onClick={() => paginate(index + 1)}
    >
      {index + 1}
    </button>
  ))}
</div>
        
        {showModal && (
  <div className="smm-modal-overlay">
    <div className="smm-modal">
      <div className="smm-modal-header">
        Booking Details
        <button className="smm-modal-close" onClick={handleCloseModal}>×</button>
      </div>
      {selectedBooking && (
        <div className="smm-modal-body">
          <p><strong>Booking ID:</strong> {selectedBooking.id}</p>
          <p><strong>Phone number:</strong> {selectedBooking.phone}</p>
          <p><strong>Date:</strong> {selectedBooking.created_at}</p>
          <p><strong>Service:</strong> {selectedBooking.service}</p>
          <p><strong>Status:</strong> {selectedBooking.status}</p>
        </div>
      )}
      <div className="smm-modal-footer">
        <button onClick={handleCloseModal}>Close</button>
      </div>
    </div>
  </div>
)}

      </div>)}
      {activeSection === "project" && (
  <div className="smm-main">
  <h2>Projects</h2>
  <table className="smm-table">
    <thead>
      <tr>
        <th>Booking ID</th>
        <th>Services</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
    {currentData.length === 0 ? (
      <tr>
        <td colSpan="6" className="text-center">No bookings found</td>
      </tr>
    ) : (
      currentData.map((b) => (
        <tr key={b.id}>
          <td>{b.id}</td>
        
          <td>{b.service}</td>
          <td><span className={`badge ${getBadgeClass(b.status)}`}>{b.status}</span></td>
          <td><button onClick={() => handleView(b)}>View</button></td>
        </tr>
      ))
    )}
    </tbody>
  </table>

    
{/* Pagination */}
<div className="pagination">
  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index + 1}
      className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
      onClick={() => paginate(index + 1)}
    >
      {index + 1}
    </button>
  ))}
</div>    
  {/* MODAL */}
{showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3 className="modal-title">Booking Details</h3>

      <div className="form-grid">
        {/* Booking ID and Service Date */}
        <div className="form-row">
          <label>Booking ID:
            <input type="text" value={formData.id} readOnly />
          </label>
          <label>Date of Service:
            <input
              type="date"
              className="date-input"
              value={formData.date}
              disabled={isReadonly}
              onChange={(e) => handleChange('date', e.target.value)}
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
            />
          </label>
        </div>

        {/* Start/End Time and Summary */}
        <div className="form-row time-section">
          {renderTimePicker('Start Time', startTime, setStartTime, isReadonly)}
          {renderTimePicker('End Time', endTime, setEndTime, isReadonly)}

          <div className="time-summary">
            <label>Total Booking Hours
              <input type="text" value={bookingHours ? `${bookingHours} hour(s)` : ''} readOnly />
            </label>
            <label>Total Cost
              <input type="text" value={totalCost ? `₹${totalCost}` : ''} readOnly />
            </label>
          </div>
        </div>

        {/* Service and People */}
        <div className="form-row">
          <label>Service Requested:
            <select value={formData.service || ""} onChange={(e) => handleChange('service', e.target.value)} disabled={isReadonly}>
              <option>Photography</option>
              <option>Videography</option>
              <option>Photo & Video Editing</option>
              <option>Graphic Designing</option>
            </select>
          </label>
          <label>People:
            <select value={formData.people || ""} onChange={(e) => handleChange('people', e.target.value)} disabled={isReadonly}>
              {[...Array(100).keys()].map((n) => <option key={n + 1}>{n + 1}</option>)}
            </select>
          </label>
        </div>

        {/* Address & Phone */}
        <div className="form-row">
          <label>Address:
            <input
              type="text"
              value={formData.address || ""}
              onChange={(e) => handleChange('address', e.target.value)}
              disabled={isReadonly}
            />
          </label>
          <label>Phone:
            <input
              type="text"
              value={formData.phone || ""}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={isReadonly}
            />
          </label>
        </div>

        {/* Email & Instructions */}
        <div className="form-row">
          <label>Email:
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={isReadonly}
            />
          </label>
          <label>Instructions:
            <textarea
              value={formData.instructions || ""}
              onChange={(e) => handleChange('instructions', e.target.value)}
              disabled={isReadonly}
            />
          </label>
        </div>

        {/* Rating */}
        <div className="form-row">
          <label>Rate Us:
            <div className="star-rating">
              {renderStarRating(isReadonly)}
            </div>
          </label>
        </div>
      </div>

      {/* Button Actions */}
      <div className="button-row">
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleSave} disabled={!formChanged}>Save</button>
        <button onClick={generateQuotation} disabled={!quotationGenerated}>
  Generate Quotation
</button>


        <button disabled={!quotationGenerated} onClick={viewQuotation}><FaFilePdf style={{ marginRight: 5 }} /> View Quotation</button>
        <button onClick={() => setShowModal(false)}>Close</button>
      </div>
    </div>
  </div>
)}

{showQuotationModal && (
  <div className="modal-overlay">
    <div className="quotation-modal">
      <div className="modal-header">
        <h2><FaFilePdf style={{ marginRight: 10 }} /> Quotation Preview</h2>
        <button className="close-btn" onClick={() => setShowQuotationModal(false)}>
          <FaTimes />
        </button>
      </div>

      <div className="modal-body">
        <pre className="quotation-text">{quotation || "No quotation available."}</pre>
      </div>

      <div className="modal-footer">
        <button onClick={downloadPDF} className="btn-download">
          <FaDownload style={{ marginRight: 8 }} /> Download PDF
        </button>
      </div>
    </div>
  </div>
)}



      </div>)}
  {activeSection === "task" && (
  <div className="smm-main">
  <div className="task-bookings-container">
      <div className="task-filter-section">
        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
          <option value="All">All Services</option>
          <option value="Photography">Photography</option>
          <option value="Videography">Videography</option>
          <option value="Photoediting">Photoediting</option>
          <option value="Videoediting">Videoediting</option>
          <option value="Graphic Designing">Graphic Designing</option>
        </select>

        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />

     

      </div>

      <table className="task-bookings-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Start Date</th>
            <th>Status</th>
            <th>Assign To</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentBookings.map(booking => (
            <tr key={booking.id}>
              <td>{booking.service}</td>
              <td>{booking.date}</td>
              <td>{booking.status}</td>
              <td>
  {booking.assigned_employees && booking.assigned_employees.length > 0
    ? booking.assigned_employees.map((emp) => emp.name).join(', ')
    : 'Unassigned'}
</td>


              <td>
                <button classname = "task-button" onClick={() => openModal(booking)}>Edit</button>
                <button classname = "task-button" onClick={() => handleDelete(booking.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="task-pagination">
        {Array.from({ length: totalPage }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? 'task-active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>

      {showModal && selectedBooking && (
        <div className="task-modal">
          <div className="task-modal-content">
            <div className="task-modal-header">
              <h2>Select Employees</h2> 
              <button className="task-close-btn" onClick={closeModal}>×</button>
            </div>

            <div className="task-employee-filter">
              {['All', 'photographer', 'videographer', 'photo editor', 'video editor', 'graphic designer'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setEmployeeFilter(filter)}
                  className={employeeFilter === filter ? 'task-filter-btn-active' : ''}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="task-employee-list">
              {employeesList
                .filter(emp => employeeFilter === 'All' || emp.profession === employeeFilter)
                .map(emp => (
                  <div key={emp.id} className="task-employee-item">
                    <input
                      type="checkbox"
                      checked={selectedBooking.assignedEmployeeIds.includes(emp.id)}
                      onChange={() => toggleEmployee(emp.id)}
                    />
                    <label>{emp.name} ({emp.profession})</label>
                  </div>
                ))}
            </div>

            <button className="task-save-btn" onClick={handleAssign}>Save</button>
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
        <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>Projects</button>
        <button className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}>Employees</button>
      </div>



      {/* Graphs based on selected tab */}
      <div className="charts-section">
        {activeTab === 'clients' && (
          <>
           <div className="charts-row">
           <div className="chart-box">
            <h4>Clients: Services Booked</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
             </div>

             <div className="chart-box">
            <h4>Clients: Status Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={statusCountData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      // Removed label prop here
    >
      {statusCountData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={statusColors[entry.name] || '#ccc'} />
      ))}
    </Pie>
    <Tooltip />
    <Legend layout="vertical" align="right" verticalAlign="middle" />  </PieChart>
</ResponsiveContainer>
            </div>
            </div>
          </>
        )}

{activeTab === 'projects' && (
  <>
    <div className="charts-row">
      {/* ✅ Bar chart for dynamic project counts */}
      <div className="chart-box">
        <h4>Projects Overview</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Pie chart for dynamic project distribution */}
      <div className="chart-box">
        <h4>Projects Completion</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={projectData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {projectData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === "Completed" ? "#4caf50" : "#f44336"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" align="right" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </>
)}


        {activeTab === 'employees' && (
          <>
          <div className="charts-row">
          <div className="chart-box">
            <h4>Employee Assignments</h4>
           <ResponsiveContainer width="100%" height={300}>
  <LineChart data={employeeAssignments}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="assignments" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>

            </div>

            <div className="chart-box">
            <h4>Employees: Service Type</h4>
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={employeePieData}
      dataKey="value"
      nameKey="name"
      outerRadius={100}
      fill="#8884d8"
      label
    >
      {employeePieData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend layout="vertical" align="right" verticalAlign="bottom" />
  </PieChart>
</ResponsiveContainer>

            </div>
        </div>
          </>
        )}
      </div>

    </div>
      </div>)}

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
              <a
  href={`http://localhost:8000/api/reports/download/${report.id}/`}
  className="btn-download"
  target="_blank"
  rel="noopener noreferrer"
>
  Download
</a>

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
};


const getBadgeClass = (status) => {
  switch (status) {
    case 'Delivered':
    case 'Payment received':
      return 'bg-success';
    case 'Quotation sent by YGP':
    case 'Quotation approved by customer':
      return 'bg-info text-dark';
    case 'Service Booked':
    case 'Service Under Review':
      return 'bg-warning text-dark';
    case 'Under Fulfillment':
      return 'bg-secondary';
    default:
      return 'bg-danger'; // Default case for unknown statuses
  }
};


export default SMMDashboard;
