import httpError from 'http-errors';
import Order from '../models/Order.js';

export const createOrder = async (req, res, next) => {
	try {
		const { cartItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, phone, city, user } =
			req.body;

		if (
			!cartItems ||
			!paymentMethod ||
			!itemsPrice ||
			!shippingPrice ||
			!totalPrice ||
			!fullName ||
			!address ||
			!phone ||
			!city ||
			!user
		)
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'The input is required',
			});

		const createOrder = await Order.create({
			cartItems,
			shippingAddress: {
				fullName,
				address,
				phone,
				city,
			},
			paymentMethod,
			itemsPrice,
			shippingPrice,
			totalPrice,
			user: user,
		});
		if (createOrder) {
			return res.status(200).json({
				statusCode: 200,
				statusMessage: 'success',
				data: createOrder,
			});
		}
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};
