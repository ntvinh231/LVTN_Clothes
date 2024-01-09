import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import { createCart, getCartUser, removeAllFromCart, removeCart } from '../controllers/CartController.js';

const router = express.Router();
router.post('/create', isLoggedIn, createCart);
router.post('/remove', isLoggedIn, removeCart);
router.post('/removeAll', isLoggedIn, removeAllFromCart);
router.get('/getCartUser/:userId', isLoggedIn, getCartUser);

export default router;
