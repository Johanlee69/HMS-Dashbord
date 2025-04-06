import express from 'express';
import {
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
  getBillsByStatus,
  getPatientBills,
  recordPayment,
  getAllInsuranceClaims,
  getInsuranceClaimById,
  createInsuranceClaim,
  updateInsuranceClaim,
  updateClaimStatus,
  deleteInsuranceClaim,
  getInsuranceClaimsByStatus,
  getPatientInsuranceClaims,
  getRevenueStats,
  getPendingPayments,
  getOverduePayments
} from '../controllers/financeController.js';

const router = express.Router();

// Bills routes
// GET /api/finance/bills
router.get('/bills', getAllBills);

// GET /api/finance/bills/:id
router.get('/bills/:id', getBillById);

// POST /api/finance/bills
router.post('/bills', createBill);

// PUT /api/finance/bills/:id
router.put('/bills/:id', updateBill);

// DELETE /api/finance/bills/:id
router.delete('/bills/:id', deleteBill);

// GET /api/finance/bills/status/:status
router.get('/bills/status/:status', getBillsByStatus);

// GET /api/finance/bills/patient/:patientId
router.get('/bills/patient/:patientId', getPatientBills);

// POST /api/finance/bills/:billId/payments
router.post('/bills/:billId/payments', recordPayment);

// Insurance claims routes
// GET /api/finance/insurance
router.get('/insurance', getAllInsuranceClaims);

// GET /api/finance/insurance/:id
router.get('/insurance/:id', getInsuranceClaimById);

// POST /api/finance/insurance
router.post('/insurance', createInsuranceClaim);

// PUT /api/finance/insurance/:id
router.put('/insurance/:id', updateInsuranceClaim);

// PATCH /api/finance/insurance/:id/status
router.patch('/insurance/:id/status', updateClaimStatus);

// DELETE /api/finance/insurance/:id
router.delete('/insurance/:id', deleteInsuranceClaim);

// GET /api/finance/insurance/status/:status
router.get('/insurance/status/:status', getInsuranceClaimsByStatus);

// GET /api/finance/insurance/patient/:patientId
router.get('/insurance/patient/:patientId', getPatientInsuranceClaims);

// Statistics routes
// GET /api/finance/stats/revenue
router.get('/stats/revenue', getRevenueStats);

// GET /api/finance/stats/pending
router.get('/stats/pending', getPendingPayments);

// GET /api/finance/stats/overdue
router.get('/stats/overdue', getOverduePayments);

export default router; 