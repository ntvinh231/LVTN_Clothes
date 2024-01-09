import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import { createOrder } from '../controllers/orderController.js';

const router = express.Router();
router.post('/create', isLoggedIn, createOrder);

export default router;
