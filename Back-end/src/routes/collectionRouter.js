import express from 'express';
const collectionRouter = express.Router();
import isLoggedIn from '../middleware/isLoggedIn.js';
import restricTo from '../middleware/checkRole.js';
import {
	createCollectionsController,
	deleteCollectionsController,
	deleteManyCollection,
	getCollections,
	updateCollection,
} from '../controllers/collectionsController.js';

//Get all and getOne
// api/product/collections or api/product/collection?id=...
collectionRouter.get('/collections', getCollections);

collectionRouter.use(isLoggedIn);
collectionRouter.post('/collections', restricTo('admin', 'superadmin'), createCollectionsController);
collectionRouter.put('/collections/:id', isLoggedIn, restricTo('admin', 'superadmin'), updateCollection);
collectionRouter.delete('/collections', restricTo('admin', 'superadmin'), deleteCollectionsController);
collectionRouter.delete('/collection-many', restricTo('admin', 'superadmin'), deleteManyCollection);
export default collectionRouter;
