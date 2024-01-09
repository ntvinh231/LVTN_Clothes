import httpError from 'http-errors';
import Product from '../models/Product.js';

export const checkProductDetails = async (req, res, next) => {
	try {
		const { name, quantity, size, collections_id } = req.body;

		if (!name) {
			return res.status(200).json({
				statusCode: 200,
				statusMessage: 'failed',
				message: 'The product is required',
			});
		}

		const checkProduct = await Product.findOne({
			name: name,
			size: { $regex: new RegExp(`^${size}$`, 'i') }, // Sử dụng biểu thức chính quy không phân biệt chữ hoa thường
			quantity: { $gte: quantity }, // Kiểm tra quantity lớn hơn hoặc bằng quantity truyền vào
			collections_id: collections_id,
		}).select('-image');

		if (checkProduct == null) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The product is sold out',
			});
		}

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: checkProduct,
		});
	} catch (error) {
		console.log(error);
		return next(httpError(500, error));
	}
};
