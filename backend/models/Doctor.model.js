import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const DoctorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  contact: {
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  appointments: [
    {
      appointment_id: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
      },
      patient_id: {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
      },
      date: {
        type: Date
      },
      status: {
        type: String,
        enum: ['confirmed', 'pending', 'completed'],
        default: 'pending'
      }
    }
  ],
  medical_records_access: [
    {
      patient_id: {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
      },
      access_date: {
        type: Date,
        default: Date.now
      },
      reason: {
        type: String
      }
    }
  ]
});

export default model('Doctor', DoctorSchema);
