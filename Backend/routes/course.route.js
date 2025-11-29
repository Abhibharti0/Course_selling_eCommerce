import express from 'express';
import { createCourse,updateCourse,deleteCourse,getAllCourses } from '../controllers/course.controller.js';

const router = express.Router();


router.post('/create', createCourse);
router.put('/update/:id', updateCourse);
router.delete('/delete/:id', deleteCourse);
router.get('/allcourses', getAllCourses);



export default router;