import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaCalendarCheck, FaClipboardList, FaCalendarPlus, FaSync } from 'react-icons/fa';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../common/StatCard';
import StaffList from './StaffList';
import AttendanceTracker from './AttendanceTracker';
import { StaffAPI } from '../../services/api';
import { toast } from 'react-toastify';

const StaffDashboard = ({ activeTab: initialActiveTab = 'staff' }) => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [stats, setStats] = useState({
    totalStaff: 0,
    presentToday: 0,
    shiftsCount: 3 // Default value
  });

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const response = await StaffAPI.getAllStaff();
      console.log('Staff API response:', response);
      // Check if we have valid data
      if (!response || !response.data) {
        console.warn('Invalid staff data response:', response);
        return;
      }
      // Ensure we have an array
      const staffData = Array.isArray(response.data) ? response.data : [];
      setStaff(staffData);
      
      // Update stats with staff count
      setStats(prevStats => ({
        ...prevStats,
        totalStaff: staffData.length
      }));
      
      return staffData;
    } catch (error) {
      console.error('Error fetching staff data:', error);
      toast.error('Failed to load staff data');
      setStats(prevStats => ({
        ...prevStats,
        totalStaff: 0
      }));
      return [];
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await StaffAPI.getAttendanceByDate(today);
      
      const attendanceData = Array.isArray(response.data) ? response.data : [];
      setAttendance(attendanceData);
      
      // Calculate present today
      const presentToday = attendanceData.filter(a => a.status === 'Present').length;
      
      // Update stats with attendance count
      setStats(prevStats => ({
        ...prevStats,
        presentToday: presentToday
      }));
      
      return attendanceData;
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to load attendance data');
      setStats(prevStats => ({
        ...prevStats,
        presentToday: 0
      }));
      return [];
    }
  };

  // Main data fetching function
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch staff data first
      await fetchStaffData();
      
      // Then fetch attendance data
      await fetchAttendanceData();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout dashboardType="doctor">
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 lg:mb-0">Staff Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchDashboardData}
            className="flex items-center space-x-1 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            <span>Refresh Data</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/doctor/attendance/record')}
            className="flex items-center space-x-1 px-4 py-2 cursor-pointer bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FaCalendarPlus />
            <span>Record Attendance</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard 
              title="Total Staff" 
              value={stats.totalStaff} 
              icon={<FaUserMd />} 
              color="green" 
              subtitle="Registered staff"
            />
            <StatCard 
              title="Present Today" 
              value={stats.presentToday} 
              icon={<FaCalendarCheck />} 
              color="blue" 
              subtitle={`Out of ${stats.totalStaff} staff`}
            />
            <StatCard 
              title="Shifts" 
              value={stats.shiftsCount} 
              icon={<FaClipboardList />} 
              color="yellow" 
              subtitle="Morning, Afternoon, Night"
            />
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex -mb-px">
              <button
                className={`mr-8 py-4 px-1 ${
                  activeTab === 'staff'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800 hover:border-gray-300'
                } cursor-pointer`}
                onClick={() => setActiveTab('staff')}
              >
                Staff Roster
              </button>
              <button
                className={`mr-8 py-4 px-1 ${
                  activeTab === 'attendance'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800 hover:border-gray-300'
                } cursor-pointer`}
                onClick={() => setActiveTab('attendance')}
              >
                Attendance
              </button>
            </nav>
          </div>

          {/* Content based on active tab */}
          <div className="bg-white rounded-lg shadow">
            {activeTab === 'staff' && <StaffList />}
            {activeTab === 'attendance' && <AttendanceTracker />}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default StaffDashboard; 