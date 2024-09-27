import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Main Cart Schema
const CartSchema = new Schema({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  medicines: [
    {
      medicine_id: {
        type: Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
      },
      medicine_name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      dosage: {
        type: String,
        required: true
      }
    }
  ],
  delivery_date: {
    type: Date,
    required: true
  },
  order_status: {
    type: String,
    enum: ['pending', 'confirmed', 'out_for_delivery', 'delivered', 'canceled'],
    default: 'pending'
  },
  delivery_address: {
    address_line1: {
      type: String,
      required: true
    },
    address_line2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip_code: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  billing_address: {
    address_line1: {
      type: String,
      required: true
    },
    address_line2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip_code: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default model('Cart', CartSchema);
