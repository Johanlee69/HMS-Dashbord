import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  admittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  bedNumber: {
    type: String,
    required: true
  },
  admissionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dischargeDate: {
    type: Date
  },
  diagnosis: {
    type: String,
    required: true
  },
  treatmentPlan: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['Admitted', 'Discharged'],
    default: 'Admitted'
  }
}, {
  timestamps: true
});

const Admission = mongoose.model('Admission', admissionSchema);

export default Admission; 