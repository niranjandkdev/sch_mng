import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import studentRoutes from './routes/studentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Student Course Management API is running.' }));
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use((error, req, res, next) => { console.error(error); res.status(500).json({ message: 'Internal server error.' }); });

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch(error => {
    console.error('\nCould not connect to MongoDB.');
    console.error('Make sure MongoDB Community Server is running, then try again.');
    console.error(error.message);
    process.exit(1);
  });
