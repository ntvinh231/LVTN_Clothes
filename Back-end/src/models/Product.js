import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
	name: String,
	image: String,
	price: Number,
	description: String,
	collections_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Collections', required: true },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
