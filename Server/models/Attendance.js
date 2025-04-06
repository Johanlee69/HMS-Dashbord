import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkIn: {
    type: String,
    required: true
  },
  checkOut: {
    type: String
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Half Day', 'On Leave'],
    default: 'Present'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate attendance records
attendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance; 