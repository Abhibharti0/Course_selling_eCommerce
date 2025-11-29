import express from 'express';
import { createCourse,updateCourse } from '../controllers/course.controller.js';

const router = express.Router();


router.post('/create', createCourse);
router.put('/update/:id', updateCourse);
    

export default router;