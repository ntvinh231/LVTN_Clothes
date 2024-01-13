import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const discountSchema = new mongoose.Schema({
	start_day: Date,
	end_day: Date,
	percent: String,
});

discountSchema.set('toJSON', { virtuals: true });
discountSchema.set('toObject', { virtuals: true });
discountSchema.virtual('list_product', {
	ref: 'Product',
	localField: '_id',
	foreignField: 'discount_id',
	justOne: false,
	options: { select: '_id' },
});

discountSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Discount = mongoose.model('Discount', discountSchema);

export default Discount;
