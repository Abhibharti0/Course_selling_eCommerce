import express from 'express';
import { createCourse,updateCourse,deleteCourse,getAllCourses, getCourseById,buyCourses} from '../controllers/course.controller.js';

import usermiddleware from '../middlewares/user.mid.js';

const router = express.Router();


router.post('/create', createCourse);
router.put('/update/:id', updateCourse);
router.delete('/delete/:id', deleteCourse);
router.get('/allcourses', getAllCourses);
router.get('/getonecouse/:id', getCourseById);


router.post("/buy/:courseId",usermiddleware, buyCourses);

export default router;