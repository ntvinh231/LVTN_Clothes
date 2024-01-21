import express from 'express';

const router = express.Router();
import {
	createProduct,
	deleteProduct,
	deleteManyProduct,
	getProduct,
	updateProduct,
	getProductAdmin,
	getProductTypePagi,
	getProductBestSelled,
	uploadImagesProduct,
} from '../controllers/productController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';
import restricTo from '../middleware/checkRole.js';
import collectionsRouter from './CollectionRouter.js';
import { checkProductDetails } from '../controllers/productDetailsController.js';
import uploadCloud from '../configs/cloudinary.config.js';

//Product Details
router.post('/checkProductDetails', checkProductDetails);
router.get('/', getProduct);
//Best Selled
router.get('/best-sellers', getProductBestSelled);
router.get('/getProductTypePagi', getProductTypePagi);
//Image cloudinary
router.post(
	'/upload-image',
	isLoggedIn,
	restricTo('admin', 'superadmin'),
	uploadCloud.single('images'),
	uploadImagesProduct
);
router.get('/admin', getProductAdmin);
router.use('/', collectionsRouter);
router.post('/create', isLoggedIn, restricTo('admin', 'superadmin'), createProduct);
router.put('/update/:id', isLoggedIn, restricTo('admin', 'superadmin'), updateProduct);
router.delete('/delete/:id', isLoggedIn, restricTo('admin', 'superadmin'), deleteProduct);
router.delete('/delete-many', isLoggedIn, restricTo('admin', 'superadmin'), deleteManyProduct);

export default router;
