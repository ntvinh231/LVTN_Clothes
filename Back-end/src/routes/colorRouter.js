import express from 'express';
const router = express.Router();
import isLoggedIn from '../middleware/isLoggedIn.js';
import restricTo from '../middleware/checkRole.js';
import {
	createColorsController,
	deleteColorsController,
	deleteManyColors,
	getAllColorOfProduct,
	getColors,
	updateColors,
} from '../controllers/colorController.js';

//Get all and getOne
router.get('/', getColors);
router.post('/getall-color-of-product', getAllColorOfProduct);

// colorRouter.use(isLoggedIn);
router.post('/', isLoggedIn, restricTo('admin', 'superadmin'), createColorsController);
router.put('/:id', isLoggedIn, restricTo('admin', 'superadmin'), updateColors);
router.delete('/', isLoggedIn, restricTo('admin', 'superadmin'), deleteColorsController);
router.delete('/color-many', isLoggedIn, restricTo('admin', 'superadmin'), deleteManyColors);
export default router;
