import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  staffId: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Doctor', 'Nurse', 'Receptionist', 'Lab Technician', 'Admin', 'Other']
  },
  department: {
    type: String,
    required: true,
    enum: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Gynecology', 'General', 'Emergency', 'Administration']
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  qualification: {
    type: String
  },
  schedule: [{
    day: String,
    startTime: String,
    endTime: String
  }]
}, {
  timestamps: true
});

const Staff = mongoose.model('Staff', staffSchema);

export default Staff; 