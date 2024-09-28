import Patient from '../models/Patient'; 
import Appointment from '../models/Appointment';
import Prescription from '../models/Prescription'; 

// Create a new patient
export const createPatient = async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.status(201).json({ message: 'Patient registered successfully', data: newPatient });
  } catch (error) {
    res.status(400).json({ message: 'Error creating patient', error });
  }
};

// Update existing patient details
export const updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Patient updated successfully', data: updatedPatient });
  } catch (error) {
    res.status(400).json({ message: 'Error updating patient', error });
  }
};

// Book an appointment
export const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date } = req.body;

    const newAppointment = new Appointment({
      patient_id: patientId,
      doctor_id: doctorId,
      date,
      status: 'pending'
    });

    await newAppointment.save();

    await Patient.findByIdAndUpdate(
      patientId,
      { $push: { appointments: { appointment_id: newAppointment._id, doctor_id: doctorId, date } } },
      { new: true }
    );

    res.status(201).json({ message: 'Appointment booked successfully', data: newAppointment });
  } catch (error) {
    res.status(400).json({ message: 'Error booking appointment', error });
  }
};

// Get patient's medical history
export const getMedicalHistory = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.findById(patientId).populate('medical_history.doctor_id').populate('medical_history.prescription_id');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    
    res.status(200).json({ medical_history: patient.medical_history });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving medical history', error });
  }
};

// Manage prescriptions (add/update)
export const managePrescription = async (req, res) => {
  try {
    const { patientId, prescriptionId } = req.body;
    const patient = await Patient.findById(patientId);

    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    patient.medical_history.push({
      doctor_id: req.body.doctorId,
      diagnosis: req.body.diagnosis,
      prescription_id: prescriptionId,
      visit_date: new Date(),
    });

    await patient.save();
    res.status(200).json({ message: 'Prescription added successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error managing prescription', error });
  }
};

// Retrieve notifications
export const getNotifications = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.findById(patientId);
    
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    
    res.status(200).json({ notifications: patient.notifications });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving notifications', error });
  }
};

// Donate medicine
export const donateMedicine = async (req, res) => {
  // Assume you have a MedicineDonation model to track donations
  try {
    const { patientId, medicineDetails } = req.body;

    res.status(200).json({ message: 'Medicine donation processed successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error donating medicine', error });
  }
};

// Get nearby doctors or pharmacies (dummy implementation)
export const getNearbyDoctorsPharmacies = async (req, res) => {
  try {
    
    const results = [
      { name: 'Doctor A', location: 'Location A' },
      { name: 'Pharmacy B', location: 'Location B' },
    ];

    res.status(200).json({ results });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching nearby doctors/pharmacies', error });
  }
};

// Get patient's appointments
export const getAppointments = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.findById(patientId).populate('appointments.doctor_id').populate('appointments.appointment_id');
    
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    res.status(200).json({ appointments: patient.appointments });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving appointments', error });
  }
};

// Request emergency blood
export const requestEmergencyBlood = async (req, res) => {
  try {
    const { patientId, bloodGroup } = req.body;
    
    res.status(200).json({ message: 'Emergency blood request sent successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error requesting emergency blood', error });
  }
};
