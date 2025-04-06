import express from 'express';
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffByDepartment,
  getStaffByRole,
  getDoctorAppointments,
  getStaffSchedule
} from '../controllers/staffController.js';

const router = express.Router();

// GET /api/staff
router.get('/', getAllStaff);

// GET /api/staff/:id
router.get('/:id', getStaffById);

// POST /api/staff
router.post('/', createStaff);

// PUT /api/staff/:id
router.put('/:id', updateStaff);

// DELETE /api/staff/:id
router.delete('/:id', deleteStaff);

// GET /api/staff/department/:department
router.get('/department/:department', getStaffByDepartment);

// GET /api/staff/role/:role
router.get('/role/:role', getStaffByRole);

// GET /api/staff/:id/appointments
router.get('/:id/appointments', getDoctorAppointments);

// GET /api/staff/:id/schedule
router.get('/:id/schedule', getStaffSchedule);

export default router; 