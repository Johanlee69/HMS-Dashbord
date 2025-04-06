import Attendance from '../models/Attendance.js';
import Staff from '../models/Staff.js';

// Get all attendance records
export const getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({})
      .populate('staffId', 'name staffId role department');
    
    res.json(attendanceRecords);
  } catch (error) {
    console.error('Error in getAllAttendance:', error);
    res.status(500).json({ message: 'Server error while fetching attendance records' });
  }
};

// Get attendance records by date
export const getAttendanceByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const attendanceRecords = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('staffId', 'name staffId role department');
    
    res.json(attendanceRecords);
  } catch (error) {
    console.error('Error in getAttendanceByDate:', error);
    res.status(500).json({ message: 'Server error while fetching attendance records by date' });
  }
};

// Get attendance records for a specific staff member
export const getStaffAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ staffId: req.params.staffId })
      .sort({ date: -1 })
      .populate('staffId', 'name staffId role department');
    
    res.json(attendance);
  } catch (error) {
    console.error('Error in getStaffAttendance:', error);
    res.status(500).json({ message: 'Server error while fetching staff attendance' });
  }
};

// Mark attendance
export const markAttendance = async (req, res) => {
  try {
    // Find staff member to validate
    const staff = await Staff.findById(req.body.staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const attendanceDate = new Date(req.body.date);
    
    // Check if attendance already exists for this staff on this date
    const existingAttendance = await Attendance.findOne({
      staffId: req.body.staffId,
      date: {
        $gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
        $lt: new Date(attendanceDate.setHours(23, 59, 59, 999))
      }
    });
    
    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.checkIn = req.body.checkIn || existingAttendance.checkIn;
      existingAttendance.checkOut = req.body.checkOut || existingAttendance.checkOut;
      existingAttendance.status = req.body.status || existingAttendance.status;
      existingAttendance.notes = req.body.notes || existingAttendance.notes;
      
      const updatedAttendance = await existingAttendance.save();
      return res.json(updatedAttendance);
    }
    
    // Create new attendance record
    const attendance = new Attendance({
      staffId: req.body.staffId,
      date: attendanceDate,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      status: req.body.status,
      notes: req.body.notes
    });
    
    const createdAttendance = await attendance.save();
    res.status(201).json(createdAttendance);
  } catch (error) {
    console.error('Error in markAttendance:', error);
    res.status(500).json({ message: 'Server error while marking attendance' });
  }
};

// Update attendance
export const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    if (req.body.staffId) attendance.staffId = req.body.staffId;
    if (req.body.date) attendance.date = req.body.date;
    if (req.body.checkIn) attendance.checkIn = req.body.checkIn;
    if (req.body.checkOut) attendance.checkOut = req.body.checkOut;
    if (req.body.status) attendance.status = req.body.status;
    if (req.body.notes) attendance.notes = req.body.notes;
    
    const updatedAttendance = await attendance.save();
    res.json(updatedAttendance);
  } catch (error) {
    console.error('Error in updateAttendance:', error);
    res.status(500).json({ message: 'Server error while updating attendance' });
  }
}; 