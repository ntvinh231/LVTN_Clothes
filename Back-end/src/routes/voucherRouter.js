import express from 'express';

import {
	createVoucher,
	deleteManyVoucher,
	deleteVoucher,
	getVoucher,
	getVoucherById,
	updateVoucher,
} from '../controllers/voucherController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';
import restricTo from '../middleware/checkRole.js';

const router = express.Router();

router.get('/voucher', getVoucher);
router.get('/voucher/:id', getVoucherById);
router.post('/create-voucher', isLoggedIn, restricTo('admin', 'superadmin'), createVoucher);
router.delete('/delete/:id', isLoggedIn, restricTo('admin', 'superadmin'), deleteVoucher);
router.delete('/delete-many', isLoggedIn, restricTo('admin', 'superadmin'), deleteManyVoucher);
router.patch('/update/:id', isLoggedIn, restricTo('admin', 'superadmin'), updateVoucher);
export default router;
