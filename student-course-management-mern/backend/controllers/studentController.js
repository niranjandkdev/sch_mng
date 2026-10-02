import mongoose from 'mongoose';
import Student from '../models/Student.js';
import Enrollment from '../models/Enrollment.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

function validate(data) {
  const { name, email, phone, course, dateOfJoining } = data;
  if (![name, email, phone, course, dateOfJoining].every(v => String(v ?? '').trim())) return 'All fields are required.';
  if (!emailRegex.test(email.trim())) return 'Enter a valid email address.';
  if (!phoneRegex.test(phone.trim())) return 'Phone number must contain exactly 10 digits.';
  const date = new Date(dateOfJoining);
  if (Number.isNaN(date.getTime())) return 'Enter a valid date of joining.';
  return null;
}

export async function getStudents(req, res) {
  try {
    const search = String(req.query.search || '').trim();
    const filter = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } }
      ]
    } : {};
    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getStudent(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid student ID.' });
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found.' });
    res.json(student);
  } catch (error) { res.status(500).json({ message: error.message }); }
}

export async function createStudent(req, res) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ message: error });
    const student = await Student.create({
      name: req.body.name.trim(), email: req.body.email.trim(), phone: req.body.phone.trim(),
      course: req.body.course.trim(), dateOfJoining: req.body.dateOfJoining
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({ message: error.code === 11000 ? 'A student with this email already exists.' : error.message });
  }
}

export async function updateStudent(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid student ID.' });
    const error = validate(req.body);
    if (error) return res.status(400).json({ message: error });
    const student = await Student.findByIdAndUpdate(req.params.id, {
      name: req.body.name.trim(), email: req.body.email.trim(), phone: req.body.phone.trim(),
      course: req.body.course.trim(), dateOfJoining: req.body.dateOfJoining
    }, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Student not found.' });
    res.json(student);
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({ message: error.code === 11000 ? 'A student with this email already exists.' : error.message });
  }
}

export async function deleteStudent(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid student ID.' });
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found.' });
    await Enrollment.deleteMany({ student: req.params.id });
    res.json({ message: 'Student and related enrollments deleted successfully.' });
  } catch (error) { res.status(500).json({ message: error.message }); }
}
