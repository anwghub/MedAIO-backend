import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const PatientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
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
  medical_history: [
    {
      doctor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor'
      },
      diagnosis: {
        type: String
      },
      prescription_id: {
        type: Schema.Types.ObjectId,
        ref: 'Prescription'
      },
      visit_date: {
        type: Date
      }
    }
  ],
  appointments: [
    {
      appointment_id: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
      },
      doctor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor'
      },
      date: {
        type: Date
      },
      status: {
        type: String,
        enum: ['confirmed', 'pending', 'canceled'],
        default: 'pending'
      }
    }
  ],
  notifications: [
    {
      message: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread'
      }
    }
  ]
});

export default model('Patient', PatientSchema);
