import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const voucherSchema = new mongoose.Schema({
	voucherCode: String,
	totalAmount: Number,
	discountAmount: Number,
});

voucherSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Voucher = mongoose.model('Voucher', voucherSchema);

export default Voucher;
