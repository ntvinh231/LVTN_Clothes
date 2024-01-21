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
		discountedPrice: Number,
	},
	{
		timestamps: true,
	}
);

productSchema.pre('save', function (next) {
	if (this.discount && this.price) {
		const discountAmount = (this.price * this.discount) / 100;
		this.discountedPrice = this.price - discountAmount;
	} else {
		this.discountedPrice = this.price;
	}
	next();
});

productSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Product = mongoose.model('Product', productSchema);
export default Product;
