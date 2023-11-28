import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const collectionsSchema = new mongoose.Schema({
	collections_name: String,
	list_product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

collectionsSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Collections = mongoose.model('Collections', collectionsSchema);

export default Collections;
