import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StaffAPI } from '../../services/api';
import { toast } from 'react-toastify';
import DashboardLayout from '../layouts/DashboardLayout';

const RecordAttendanceForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({
    staffId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: new Date().toTimeString().split(' ')[0].substring(0, 5),
    checkOut: '',
    status: 'Present',
    notes: ''
  });

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const response = await StaffAPI.getAllStaff();
      setStaffList(response.data || []);
    } catch (error) {
      console.error('Error fetching staff list:', error);
      toast.error('Failed to load staff list');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.staffId) {
      toast.error('Please select a staff member');
      return;
    }
    
    setLoading(true);
    
    try {
      await StaffAPI.markAttendance(formData);
      toast.success('Attendance recorded successfully');
      navigate('/dashboard/doctor/attendance');
    } catch (error) {
      console.error('Error recording attendance:', error);
      const errorMsg = error.response?.data?.message || 'Failed to record attendance';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout dashboardType="doctor">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Record Staff Attendance</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Staff Selection */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="staffId">
                Staff Member *
              </label>
              <select
                id="staffId"
                name="staffId"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.staffId}
                onChange={handleChange}
                required
              >
                <option value="">Select Staff Member</option>
                {staffList.map(staff => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name} - {staff.role} ({staff.department})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                Date *
              </label>
              <input
                id="date"
                name="date"
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Check In */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="checkIn">
                Check In Time *
              </label>
              <input
                id="checkIn"
                name="checkIn"
                type="time"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.checkIn}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Check Out */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="checkOut">
                Check Out Time
              </label>
              <input
                id="checkOut"
                name="checkOut"
                type="time"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.checkOut}
                onChange={handleChange}
              />
            </div>
            
            {/* Status */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Status *
              </label>
              <select
                id="status"
                name="status"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                <option value="Half Day">Half Day</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
            
            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes or comments"
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/doctor/attendance')}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Recording...' : 'Record Attendance'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default RecordAttendanceForm; 