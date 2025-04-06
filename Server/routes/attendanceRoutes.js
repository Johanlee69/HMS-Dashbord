import express from 'express';
import { 
  getAllAttendance, 
  getAttendanceByDate, 
  getStaffAttendance, 
  markAttendance, 
  updateAttendance 
} from '../controllers/attendanceController.js';

const router = express.Router();

// GET /api/staff/attendance
router.get('/', getAllAttendance);

// GET /api/staff/attendance/date/:date
router.get('/date/:date', getAttendanceByDate);

// GET /api/staff/:staffId/attendance
router.get('/staff/:staffId', getStaffAttendance);

// POST /api/staff/attendance
router.post('/', markAttendance);

// PUT /api/staff/attendance/:id
router.put('/:id', updateAttendance);

export default router; 