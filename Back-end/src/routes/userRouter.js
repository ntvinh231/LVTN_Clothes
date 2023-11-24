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

router.post('/signup', signUp);
router.post('/signin', signIn);
router.use(isLoggedIn);
router.post('/update', updateUser);
router.get('/loggout', loggout);
router.get('/getAll', authMiddle, getAllUser);
router.get('/details/:id', authMiddle, getDetailsUser);
// router.get('/refresh-token', refreshToken);

export default router;
