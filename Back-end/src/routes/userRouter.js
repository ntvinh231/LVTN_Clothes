import express from 'express';
const router = express.Router();

import {
	getAllUser,
	getDetailsUser,
	loggout,
	refreshToken,
	signIn,
	signUp,
	updateUser,
} from '../controllers/authController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';
import authMiddle from '../middleware/authMiddle.js';
router.post('/refresh-token', refreshToken);
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/loggout', loggout);
router.use(isLoggedIn);
router.post('/update', updateUser);
router.get('/getAll', authMiddle, getAllUser);
router.get('/details/:id', authMiddle, getDetailsUser);

export default router;
