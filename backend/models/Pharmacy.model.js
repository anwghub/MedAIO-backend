import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const PharmacySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  location: {
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
  stock: [
    {
      medicine_name: {
        type: String,
        required: true
      },
      batch_no: {
        type: String,
        required: true
      },
      expiry_date: {
        type: Date,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  notifications: [
    {
      patient_id: {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
      },
      substitute_med: {
        type: String
      },
      original_med: {
        type: String
      },
      notification_date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

export default model('Pharmacy', PharmacySchema);
