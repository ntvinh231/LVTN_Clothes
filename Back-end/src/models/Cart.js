import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const cartSchema = new mongoose.Schema(
	{
		name: String,
		amount: Number,
		image: String,
		price: Number,
		size: String,
		discount_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' },
		listProduct: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{
		timestamps: true,
	}
);

cartSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
