import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const productSchema = new mongoose.Schema({
	name: String,
	price: Number,
	size: String,
	description: String,
	quantity: Number,
	image: String,
	collections_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Collections', required: true },
	discount_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount', required: true },
});

productSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Product = mongoose.model('Product', productSchema);
export default Product;
