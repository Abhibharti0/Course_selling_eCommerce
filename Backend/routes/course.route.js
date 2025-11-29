import express from 'express';
import { createCourse,updateCourse,deleteCourse,getAllCourses, getCourseById} from '../controllers/course.controller.js';

const router = express.Router();


router.post('/create', createCourse);
router.put('/update/:id', updateCourse);
router.delete('/delete/:id', deleteCourse);
router.get('/allcourses', getAllCourses);
router.get('/getonecouse/:id', getCourseById);


export default router;