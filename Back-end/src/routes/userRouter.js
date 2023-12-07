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
	updateUserForAdmin,
	deleteUser,
} from '../controllers/authController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';
import authMiddle from '../middleware/authMiddle.js';
import restricTo from '../middleware/checkRole.js';
router.post('/refresh-token', refreshToken);
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/loggout', loggout);
router.use(isLoggedIn);
router.post('/update', updateUser);
router.post('/updateForAdmin/:id', restricTo('admin', 'superadmin'), updateUserForAdmin);
router.get('/getAll', authMiddle, getAllUser);
router.get('/details/:id', authMiddle, getDetailsUser);
router.delete('/delete/:id', restricTo('admin', 'superadmin'), deleteUser);

export default router;
