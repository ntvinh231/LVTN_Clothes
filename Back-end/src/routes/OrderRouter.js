import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import { createOrder, getOrderDetails } from '../controllers/orderController.js';

const router = express.Router();
router.post('/create', isLoggedIn, createOrder);
router.post('/get-order-details/:id', isLoggedIn, getOrderDetails);

export default router;
