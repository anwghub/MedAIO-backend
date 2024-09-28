import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const DonateMedicineSchema = new Schema({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  medicine_name: {
    type: String,
    required: true
  },
  batch_number: {
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
  },
  donation_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  receiving_organization: {
    type: String,
    default: 'Not Assigned'
  }
});

export default model('DonateMedicine', DonateMedicineSchema);
