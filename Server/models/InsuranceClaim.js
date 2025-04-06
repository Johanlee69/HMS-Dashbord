import mongoose from 'mongoose';

const insuranceClaimSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  bill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
    required: true
  },
  insuranceProvider: {
    type: String,
    required: true
  },
  policyNumber: {
    type: String,
    required: true
  },
  claimAmount: {
    type: Number,
    required: true
  },
  approvedAmount: {
    type: Number
  },
  status: {
    type: String,
    required: true,
    enum: ['Submitted', 'In Process', 'Approved', 'Rejected', 'Partially Approved'],
    default: 'Submitted'
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const InsuranceClaim = mongoose.model('InsuranceClaim', insuranceClaimSchema);

export default InsuranceClaim; 