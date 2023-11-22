import express from 'express';
const router = express.Router();

import { signIn, signUp, updateUser } from '../controllers/authController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';

router.post('/signup', signUp);
router.post('/signin', signIn);
router.use(isLoggedIn);
router.post('/update', updateUser);

export default router;
