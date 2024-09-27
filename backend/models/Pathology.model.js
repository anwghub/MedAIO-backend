import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Main Pathology Schema
const PathologySchema = new Schema({
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
  test_name: {
    type: String,
    required: true
  },
  test_date: {
    type: Date,
    required: true
  },
  results: {
    type: String, // You could also use a more complex structure if needed
    required: true
  },
  normal_range: {
    type: String, // Describes the normal range for the test results
    required: true
  },
  comments: {
    type: String // Optional field for any additional notes
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default model('Pathology', PathologySchema);
