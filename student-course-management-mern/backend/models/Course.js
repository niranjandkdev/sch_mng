import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true, trim: true, unique: true },
  duration: { type: String, required: true, trim: true }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
