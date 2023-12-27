import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const orderSchema = new mongoose.Schema(
	{
		listProduct: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
		shippingAddress: {
			fullName: String,
			address: String,
			city: String,
			phone: Number,
		},
		paymentMethod: String,
		itemsPrice: Number,
		shippingPrice: Number,
		totalPrice: Number,
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		isPaid: { type: Boolean, default: false },
		paidAt: { type: Date },
		isDelivered: { type: Boolean, default: false },
		deliveredAt: { type: Date },
	},
	{
		timestamps: true,
	}
);

orderSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Order = mongoose.model('Order', orderSchema);

export default Order;
