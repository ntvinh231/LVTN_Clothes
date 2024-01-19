import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import {
	DeleteOrder,
	createOrder,
	getAllOrder,
	getAllOrderForAdmin,
	getOrderDetails,
	updateOrderForAdmin,
} from '../controllers/orderController.js';

const router = express.Router();
router.post('/create', isLoggedIn, createOrder);
router.get('/all-order/:id', isLoggedIn, getAllOrder);
router.get('/order-details/:id', isLoggedIn, getOrderDetails);
router.post('/delete', isLoggedIn, DeleteOrder);
router.get('/get-all-order', isLoggedIn, getAllOrderForAdmin);
router.post('/update-details-order', isLoggedIn, updateOrderForAdmin);

export default router;
