import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const cartSchema = new mongoose.Schema(
	{
		cartItems: [
			{
				name: String,
				amount: Number,
				image: String,
				price: Number,
				size: String,
				colors_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Color',
				},
				collections_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Collections',
				},
				collections_name: String,
				color: String,
				discount: Number,
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
				},
			},
		],

		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	},
	{
		timestamps: true,
	}
);

// Fix: Sửa tên trường từ 'cartItems' thành 'products'
cartSchema.virtual('products', {
	ref: 'Product',
	localField: 'cartItems.product',
	foreignField: '_id',
	justOne: false,
});

cartSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
