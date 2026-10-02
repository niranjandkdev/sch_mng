import mongoose from 'mongoose';
import Enrollment from '../models/Enrollment.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';

export async function getEnrollments(req, res) {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email phone course')
      .populate('course', 'courseName duration')
      .sort({ createdAt: -1 });
    res.json(enrollments.filter(e => e.student && e.course));
  } catch (error) { res.status(500).json({ message: error.message }); }
}

export async function createEnrollment(req, res) {
  try {
    const { student, course } = req.body;
    if (!mongoose.isValidObjectId(student) || !mongoose.isValidObjectId(course)) return res.status(400).json({ message: 'Select a valid student and course.' });
    const [studentExists, courseExists] = await Promise.all([Student.exists({ _id: student }), Course.exists({ _id: course })]);
    if (!studentExists) return res.status(404).json({ message: 'Student not found.' });
    if (!courseExists) return res.status(404).json({ message: 'Course not found.' });
    const exists = await Enrollment.exists({ student, course });
    if (exists) return res.status(409).json({ message: 'This student is already enrolled in this course.' });
    const enrollment = await Enrollment.create({ student, course });
    const populated = await enrollment.populate([
      { path: 'student', select: 'name email phone course' },
      { path: 'course', select: 'courseName duration' }
    ]);
    res.status(201).json(populated);
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({ message: error.code === 11000 ? 'This student is already enrolled in this course.' : error.message });
  }
}
