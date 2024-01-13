import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const productSchema = new mongoose.Schema(
	{
		name: String,
		price: Number,
		size: String,
		colors_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Colors', required: true },
		description: String,
		quantity: Number,
		selled: {
			type: Number,
			default: 0,
		},
		image: String,
		collections_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Collections', required: true },
		discount: Number,
	},
	{
		timestamps: true,
	}
);

productSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Product = mongoose.model('Product', productSchema);
export default Product;
