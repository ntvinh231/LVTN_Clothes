import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import { DeleteOrder, createOrder, getAllOrder, getOrderDetails } from '../controllers/orderController.js';

const router = express.Router();
router.post('/create', isLoggedIn, createOrder);
router.get('/all-order/:id', isLoggedIn, getAllOrder);
router.get('/order-details/:id', isLoggedIn, getOrderDetails);
router.post('/delete', isLoggedIn, DeleteOrder);

export default router;
