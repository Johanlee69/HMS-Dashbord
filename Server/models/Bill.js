import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  admission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission'
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  billType: {
    type: String,
    required: true,
    enum: ['Consultation', 'Room Charge', 'Laboratory', 'Medication', 'Other', 'Surgery', 'Lab Test']
  },
  items: [{
    name: String,
    description: String,
    quantity: Number,
    unitPrice: Number,
    amount: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Partial', 'Paid', 'Overdue'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Insurance', 'Online Payment']
  },
  billDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

const Bill = mongoose.model('Bill', billSchema);

export default Bill; 