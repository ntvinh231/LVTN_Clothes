import express from 'express';
const collectionRouter = express.Router();
import isLoggedIn from '../middleware/isLoggedIn.js';
import restricTo from '../middleware/checkRole.js';
import {
	createCollectionsController,
	deleteCollectionsController,
	getCollections,
} from '../controllers/collectionsController.js';

// api/product/collections or api/product/collection?id=...
collectionRouter.get('/collections', getCollections);
collectionRouter.use(isLoggedIn);
collectionRouter.post('/collections', restricTo('admin'), createCollectionsController);
collectionRouter.delete('/collections', restricTo('admin'), deleteCollectionsController);

export default collectionRouter;
