import express from 'express';
import { signup,login,logout,mycourse } from '../controllers/user.controller.js';
import usermiddleware from '../middlewares/user.mid.js';


const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get('/mycourses',usermiddleware,mycourse );


export default router;