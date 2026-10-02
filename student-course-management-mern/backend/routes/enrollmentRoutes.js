import { Router } from 'express';
import { getEnrollments, createEnrollment } from '../controllers/enrollmentController.js';
const router = Router();
router.get('/', getEnrollments);
router.post('/', createEnrollment);
export default router;
