import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import Admission from '../models/Admission.js';

// Get all patients
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({});
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all admissions
export const getAllAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find({})
      .populate('patient', 'name age gender contactNumber')
      .populate('admittedBy', 'name role department')
      .sort({ admissionDate: -1 });
    
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single patient
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new patient
export const createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    const createdPatient = await patient.save();
    res.status(201).json(createdPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a patient
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    Object.assign(patient, req.body);
    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a patient
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    await Patient.deleteOne({ _id: req.params.id });
    res.json({ message: 'Patient removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get patient appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.id })
      .populate('doctor', 'name role department')
      .sort({ date: -1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get patient admissions
export const getPatientAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find({ patient: req.params.id })
      .populate('admittedBy', 'name role department')
      .sort({ admissionDate: -1 });
    
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patient', 'name age gender contactNumber')
      .populate('doctor', 'name role department')
      .sort({ date: -1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    // Map the form fields to the appointment model fields
    const appointmentData = {
      patient: req.body.patientId,
      doctor: req.body.doctorId,
      date: req.body.date,
      time: req.body.time,
      status: req.body.status || 'Scheduled',
      purpose: req.body.purpose,
      notes: req.body.notes
    };

    const appointment = new Appointment(appointmentData);
    const createdAppointment = await appointment.save();
    
    res.status(201).json(createdAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update appointment
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Map the form fields to the appointment model fields
    const updatedFields = {
      patient: req.body.patientId,
      doctor: req.body.doctorId,
      date: req.body.date,
      time: req.body.time,
      status: req.body.status,
      purpose: req.body.purpose,
      notes: req.body.notes
    };
    
    // Only update fields that are provided
    Object.keys(updatedFields).forEach(key => {
      if (updatedFields[key] !== undefined) {
        appointment[key] = updatedFields[key];
      }
    });
    
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status value
    const validStatuses = ['Scheduled', 'Completed', 'Cancelled', 'No-Show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    appointment.status = status;
    const updatedAppointment = await appointment.save();
    
    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new admission
export const createAdmission = async (req, res) => {
  try {
    const admissionData = {
      patient: req.body.patientId,
      admittedBy: req.body.doctorId,
      roomNumber: req.body.roomNumber,
      bedNumber: req.body.bedNumber,
      admissionDate: req.body.admissionDate || new Date(),
      diagnosis: req.body.diagnosis,
      treatmentPlan: req.body.treatmentPlan,
      status: req.body.status || 'Admitted'
    };

    const admission = new Admission(admissionData);
    const createdAdmission = await admission.save();
    
    res.status(201).json(createdAdmission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update admission
export const updateAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }
    
    // Map the form fields to the admission model fields
    const updatedFields = {
      patient: req.body.patientId,
      admittedBy: req.body.doctorId,
      roomNumber: req.body.roomNumber,
      bedNumber: req.body.bedNumber,
      admissionDate: req.body.admissionDate,
      diagnosis: req.body.diagnosis,
      treatmentPlan: req.body.treatmentPlan,
      status: req.body.status
    };
    
    // Only update fields that are provided
    Object.keys(updatedFields).forEach(key => {
      if (updatedFields[key] !== undefined) {
        admission[key] = updatedFields[key];
      }
    });
    
    const updatedAdmission = await admission.save();
    res.json(updatedAdmission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Discharge patient
export const dischargePatient = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }
    
    admission.status = 'Discharged';
    admission.dischargeDate = req.body.dischargeDate || new Date();
    
    const updatedAdmission = await admission.save();
    res.json(updatedAdmission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 