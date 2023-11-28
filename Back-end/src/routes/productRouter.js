import express from 'express';

const router = express.Router();
import { createProduct, getProduct, updateProduct } from '../controllers/productController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';
import restricTo from '../middleware/checkRole.js';
import collectionsRouter from './CollectionRouter.js';

router.use('/', collectionsRouter);
router.get('/', getProduct);
router.use(isLoggedIn);
router.post('/create', restricTo('admin'), createProduct);
router.post('update/:id', restricTo('admin', updateProduct));

export default router;
