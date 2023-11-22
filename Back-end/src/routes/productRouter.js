import express from 'express';
const router = express.Router();
import { getProduct } from '../controllers/productController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';

router.use(isLoggedIn);
router.get('/product', getProduct);

export default router;
