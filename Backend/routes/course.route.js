import express from 'express';
import { createCourse,updateCourse,deleteCourse,getAllCourses, getCourseById,buyCourses} from '../controllers/course.controller.js';

import usermiddleware from '../middlewares/user.mid.js';
import adminmiddleware from '../middlewares/admin.mid.js';

const router = express.Router();


router.post('/create', adminmiddleware ,createCourse);
router.put('/update/:id', adminmiddleware,updateCourse);
router.delete('/delete/:id', adminmiddleware,deleteCourse);
router.get('/allcourses', getAllCourses);
router.get('/getonecouse/:id', getCourseById);


router.post("/buy/:courseId",usermiddleware, buyCourses);

export default router;