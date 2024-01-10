import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import { createOrder, getAllOrder, getOrderDetails } from '../controllers/orderController.js';

const router = express.Router();
router.post('/create', isLoggedIn, createOrder);
router.get('/all-order/:id', isLoggedIn, getAllOrder);
router.get('/order-details/:id', isLoggedIn, getOrderDetails);

export default router;
