import express from 'express';
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientAppointments,
  getPatientAdmissions,
  getAllAppointments,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  getAllAdmissions,
  createAdmission,
  updateAdmission,
  dischargePatient
} from '../controllers/patientController.js';

const router = express.Router();

// GET /api/patients
router.get('/', getPatients);

// Appointment routes
// GET /api/patients/appointments
router.get('/appointments', getAllAppointments);

// POST /api/patients/appointments
router.post('/appointments', createAppointment);

// PUT /api/patients/appointments/:id
router.put('/appointments/:id', updateAppointment);

// PATCH /api/patients/appointments/:id/status
router.patch('/appointments/:id/status', updateAppointmentStatus);

// Admission routes
// GET /api/patients/admissions
router.get('/admissions', getAllAdmissions);

// POST /api/patients/admissions
router.post('/admissions', createAdmission);

// PUT /api/patients/admissions/:id
router.put('/admissions/:id', updateAdmission);

// PATCH /api/patients/admissions/:id/discharge
router.patch('/admissions/:id/discharge', dischargePatient);

// Patient routes
// GET /api/patients/:id
router.get('/:id', getPatientById);

// POST /api/patients
router.post('/', createPatient);

// PUT /api/patients/:id
router.put('/:id', updatePatient);

// DELETE /api/patients/:id
router.delete('/:id', deletePatient);

// GET /api/patients/:id/appointments
router.get('/:id/appointments', getPatientAppointments);

// GET /api/patients/:id/admissions
router.get('/:id/admissions', getPatientAdmissions);

export default router; 