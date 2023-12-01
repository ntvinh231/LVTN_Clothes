import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const typeProductSchema = new Schema({
	product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
	collections: { type: mongoose.Schema.Types.ObjectId, ref: 'Collections', required: true },
	size: String,
	countInStock: Number,
});

typeProductSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const typeProduct = mongoose.model('typeProduct', typeProductSchema);
export default typeProduct;
