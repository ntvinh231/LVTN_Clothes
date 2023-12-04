import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const collectionsSchema = new mongoose.Schema({
	collections_name: String,
});

collectionsSchema.set('toJSON', { virtuals: true });
collectionsSchema.set('toObject', { virtuals: true });
collectionsSchema.virtual('list_product', {
	ref: 'Product',
	localField: '_id',
	foreignField: 'collections_id',
});

collectionsSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Collections = mongoose.model('Collections', collectionsSchema);

export default Collections;
