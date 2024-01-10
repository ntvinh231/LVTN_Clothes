import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const orderSchema = new mongoose.Schema(
	{
		//Cart sau khi mua thành công
		cartOrder: { type: Array, default: [] },
		shippingAddress: {
			fullName: String,
			address: String,
			phone: Number,
			city: String,
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
