import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import {
	createCart,
	decreaseAmountCart,
	getCartUser,
	increaseAmountCart,
	removeAllFromCart,
	removeCart,
} from '../controllers/CartController.js';

const router = express.Router();
router.post('/create', isLoggedIn, createCart);
router.post('/remove', isLoggedIn, removeCart);
router.post('/removeAll', isLoggedIn, removeAllFromCart);
router.post('/decreaseAmount', isLoggedIn, decreaseAmountCart);
router.post('/increaseAmount', isLoggedIn, increaseAmountCart);
router.get('/getCartUser/:userId', isLoggedIn, getCartUser);

export default router;
