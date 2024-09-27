import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const PrescriptionSchema = new Schema({
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
  medicines: [
    {
      medicine_name: {
        type: String,
        required: true
      },
      dosage: {
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
      }
    }
  ],
  issued_date: {
    type: Date,
    default: Date.now
  },
  instructions: {
    type: String
  }
});

export default model('Prescription', PrescriptionSchema);
