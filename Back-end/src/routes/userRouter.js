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
	deleteManyUser,
	updatePassword,
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
router.get('/getAll', isLoggedIn, getAllUser);
router.post('/updatePassword', updatePassword);
router.get('/details/:id', isLoggedIn, getDetailsUser);
router.delete('/delete/:id', restricTo('admin', 'superadmin'), deleteUser);
router.delete('/delete-many', restricTo('admin', 'superadmin'), deleteManyUser);

export default router;
