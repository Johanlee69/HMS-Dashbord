import Staff from '../models/Staff.js';
import Appointment from '../models/Appointment.js';

// Get all staff
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find({});
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get staff by department
export const getStaffByDepartment = async (req, res) => {
  try {
    const staff = await Staff.find({ department: req.params.department });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get staff by role
export const getStaffByRole = async (req, res) => {
  try {
    const staff = await Staff.find({ role: req.params.role });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single staff member
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new staff member
export const createStaff = async (req, res) => {
  try {
    const staff = new Staff(req.body);
    const createdStaff = await staff.save();
    res.status(201).json(createdStaff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a staff member
export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    Object.assign(staff, req.body);
    const updatedStaff = await staff.save();
    res.json(updatedStaff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a staff member
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    await Staff.deleteOne({ _id: req.params.id });
    res.json({ message: 'Staff removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get doctor's appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.id })
      .populate('patient', 'name age gender contactNumber')
      .sort({ date: -1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get staff schedule
export const getStaffSchedule = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    res.json(staff.schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 