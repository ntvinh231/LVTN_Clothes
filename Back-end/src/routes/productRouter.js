import express from 'express';

const router = express.Router();
import {
	createProduct,
	deleteProduct,
	deleteManyProduct,
	getProduct,
	updateProduct,
} from '../controllers/productController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';
import restricTo from '../middleware/checkRole.js';
import collectionsRouter from './CollectionRouter.js';

router.get('/', getProduct);
router.use('/', collectionsRouter);
router.use(isLoggedIn);
router.post('/create', restricTo('admin', 'superadmin'), createProduct);
router.put('/update/:id', restricTo('admin', 'superadmin'), updateProduct);
router.delete('/delete/:id', restricTo('admin', 'superadmin'), deleteProduct);
router.delete('/delete-many', restricTo('admin', 'superadmin'), deleteManyProduct);

export default router;
