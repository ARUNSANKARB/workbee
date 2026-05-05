import express from 'express';
const router = express.Router();
import {register,login} from '../controller/authController.js'
import upload from '../middleware/upload.js'

router.post('/register',upload.single('aadharImage'),register);

router.post('/login',login);

export default router;