import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const AppointmentSchema = new Schema({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor_id: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  appointment_time: {
    type: String, // Optional: Could also be a Date if you want to store it as a complete DateTime
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'canceled'],
    default: 'pending'
  },
  prescription_id: {
    type: Schema.Types.ObjectId,
    ref: 'Prescription'
  }
});

export default model('Appointment', AppointmentSchema);
