import httpError from 'http-errors';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res, next) => {
	try {
		const { cartItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, phone, city, user } =
			req.body;

		if (
			cartItems === undefined ||
			cartItems === null ||
			paymentMethod === undefined ||
			paymentMethod === null ||
			itemsPrice === undefined ||
			itemsPrice === null ||
			shippingPrice === undefined ||
			shippingPrice === null ||
			totalPrice === undefined ||
			totalPrice === null ||
			fullName === undefined ||
			fullName === null ||
			address === undefined ||
			address === null ||
			phone === undefined ||
			phone === null ||
			city === undefined ||
			city === null ||
			user === undefined ||
			user === null
		) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'The input is required',
			});
		}

		// Tạo mảng promises
		const promises = cartItems.map(async (cart) => {
			const productData = await Product.findOne({
				_id: cart.product,
				quantity: { $gte: cart.amount },
			});

			if (!productData) {
				return {
					statusCode: 400,
					statusMessage: 'failed',
					id: cart.product,
					name: cart.name,
				};
			}
			return productData;
		});

		// Đợi tất cả các promises hoàn thành
		const result = await Promise.all(promises);

		// Nếu có ít nhất một sản phẩm không đủ hàng, trả về lỗi
		if (result.some((item) => item && item.statusCode === 400)) {
			const insufficientStockProducts = result.filter((item) => item && item.statusCode === 400);
			const arrName = insufficientStockProducts.map((item) => item.name);
			console.log(insufficientStockProducts);
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: `Sản phẩm có tên là ${arrName.join(' và ')} không đủ hàng`,
			});
		}

		// Tạo order
		const order = await Order.create({
			cartOrder: cartItems,
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

		if (order) {
			const updatePromises = cartItems.map(async (cart) => {
				const productData = await Product.findOne({
					_id: cart.product,
				});

				if (typeof cart.amount !== 'number' || isNaN(cart.amount) || cart.amount <= 0) {
					console.error(`Lỗi: Số lượng không hợp lệ cho sản phẩm ${cart.name}`);
					return;
				}

				// Kiểm tra và xử lý trường selled để tránh lỗi CastError
				if (typeof productData.selled !== 'number' || isNaN(productData.selled)) {
					console.error(`Lỗi: Giá trị không hợp lệ cho trường selled của sản phẩm ${cart.name}`);
					return;
				}

				// Giảm quantity và tăng selled
				productData.quantity -= cart.amount;
				productData.selled += cart.amount;

				await productData.save();
			});

			await Promise.all(updatePromises);

			return res.status(200).json({
				statusCode: 200,
				statusMessage: 'success',
			});
		} else {
			// Nếu order không được tạo thành công, trả về lỗi
			return res.status(500).json({
				statusCode: 500,
				statusMessage: 'failed',
				message: 'Có lỗi xảy ra khi tạo order',
			});
		}
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const getAllOrder = async (req, res, next) => {
	try {
		const userId = req.params.id;

		if (!userId) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The userId is required',
			});
		}
		const order = await Order.find({ user: userId });
		if (!order) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The order is not defined',
			});
		}

		if (order === null) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The order is not defined',
			});
		}

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: order,
		});
	} catch (e) {
		console.log(e);
		return next(httpError(500, e));
	}
};

export const getOrderDetails = async (req, res, next) => {
	try {
		const orderId = req.params.id;

		if (!orderId) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The orderId is required',
			});
		}
		const order = await Order.findById({ _id: orderId });
		if (!order) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The Order is not defined',
			});
		}

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: order,
		});
	} catch (e) {
		console.log(e);
		return next(httpError(500, e));
	}
};

export const DeleteOrder = async (req, res, next) => {
	try {
		const data = req.body.orderItems;
		const orderId = req.body.orderId;
		const userId = req.body.userId;

		if (!orderId || !userId) {
			return res.status(400).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'The orderId and userId are required',
			});
		}

		const existingOrder = await Order.findOne({ _id: orderId, user: userId });

		if (!existingOrder) {
			return res.status(400).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Không tìm thấy đơn hàng hoặc bạn không có quyền xóa',
			});
		}

		let order = null;

		const promises = data.map(async (orderItem) => {
			const productData = await Product.findOneAndUpdate(
				{
					_id: orderItem.product,
					selled: { $gte: orderItem.amount },
				},
				{
					$inc: {
						quantity: +orderItem.amount,
						selled: -orderItem.amount,
					},
				},
				{ new: true }
			);

			if (productData) {
				order = await Order.findByIdAndDelete(orderId);

				if (!order) {
					return {
						status: 'failed',
						message: 'Không tìm thấy đơn hàng',
					};
				}
			} else {
				return {
					status: 'failed',
					message: `Failed to update product with id: ${orderItem.product}`,
				};
			}
		});

		const results = await Promise.all(promises);

		if (results.some((result) => result.status === 'failed')) {
			const errorResult = results.find((result) => result.status === 'failed');
			return res.status(400).json({
				statusCode: 400,
				statusMessage: errorResult.status,
				message: errorResult.message,
			});
		}

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			message: 'Hủy thành công đơn hàng',
			data: order,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			statusCode: 500,
			statusMessage: 'failed',
			message: 'Internal Server Error',
		});
	}
};
