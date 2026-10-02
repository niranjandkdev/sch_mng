import mongoose from 'mongoose';

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_course_management';
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  console.log('MongoDB connected');
}
