import Course from '../models/Course.js';

export async function getCourses(req, res) {
  try { res.json(await Course.find().sort({ courseName: 1 })); }
  catch (error) { res.status(500).json({ message: error.message }); }
}

export async function createCourse(req, res) {
  try {
    const courseName = String(req.body.courseName || '').trim();
    const duration = String(req.body.duration || '').trim();
    if (!courseName || !duration) return res.status(400).json({ message: 'Course name and duration are required.' });
    const course = await Course.create({ courseName, duration });
    res.status(201).json(course);
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({ message: error.code === 11000 ? 'This course already exists.' : error.message });
  }
}
