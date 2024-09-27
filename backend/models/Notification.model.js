import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const NotificationSchema = new Schema({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patient'
  },
  message: {
    type: String,
    required: true
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
});

export default model('Notification', NotificationSchema);

