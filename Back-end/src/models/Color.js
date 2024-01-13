import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const colorsSchema = new mongoose.Schema({
	color: String,
});

colorsSchema.set('toJSON', { virtuals: true });
colorsSchema.set('toObject', { virtuals: true });
colorsSchema.virtual('list_product', {
	ref: 'Product',
	localField: '_id',
	foreignField: 'colors_id',
});

colorsSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Colors = mongoose.model('Colors', colorsSchema);

export default Colors;
