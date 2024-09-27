import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const MedicalHistorySchema = new Schema({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  records: [
    {
      doctor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor'
      },
      diagnosis: {
        type: String,
        required: true
      },
      treatment: {
        type: String
      },
      visit_date: {
        type: Date,
        required: true
      }
    }
  ]
});

export default model('MedicalHistory', MedicalHistorySchema);
