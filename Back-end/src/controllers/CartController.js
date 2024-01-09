import httpError from 'http-errors';
import Cart from '../models/Cart.js';

const calculateTotalCart = (cartItems) => {
	return cartItems.reduce((total, item) => total + item.amount, 0);
};

export const createCart = async (req, res, next) => {
	try {
		const { cartItem, userId } = req.body;
		let existingCart = await Cart.findOne({ user: userId });

		if (existingCart) {
			if (existingCart.cartItems) {
				const existingProduct = existingCart.cartItems.find((p) => p.product.toString() === cartItem.product);

				if (existingProduct) {
					existingProduct.amount += cartItem.amount;
				} else {
					existingCart.cartItems.push(cartItem);
				}
			} else {
				existingCart.cartItems = [cartItem];
			}

			await existingCart.save();
		} else {
			const newCart = new Cart({
				user: userId,
				cartItems: [cartItem],
			});

			existingCart = await newCart.save();
		}

		const responseData = {
			cartItems: existingCart.cartItems,
			totalCart: calculateTotalCart(existingCart.cartItems),
			message: 'Thêm sản phẩm vào giỏ hàng thành công',
		};
		res.status(200).json(responseData);
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const removeCart = async (req, res, next) => {
	try {
		const { idProduct, userId } = req.body;

		const existingCart = await Cart.findOne({ user: userId });

		if (existingCart) {
			existingCart.cartItems = existingCart.cartItems.filter((item) => item.product.toString() !== idProduct);

			await existingCart.save();

			const responseData = {
				cartItems: existingCart.cartItems,
				totalCart: calculateTotalCart(existingCart.cartItems),
				message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
			};
			res.status(200).json(responseData);
		} else {
			res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
		}
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const removeAllFromCart = async (req, res, next) => {
	try {
		const { listChecked, userId } = req.body;

		const existingCart = await Cart.findOne({ user: userId });

		if (existingCart) {
			existingCart.cartItems = existingCart.cartItems.filter((item) => !listChecked.includes(item.product.toString()));
			await existingCart.save();
			//Sau khi xóa list xong tiến hành xóa ObjectId cart
			await Cart.deleteOne({ _id: existingCart._id });

			const responseData = {
				cartItems: existingCart.cartItems,
				totalCart: calculateTotalCart(existingCart.cartItems),
				message: 'Xóa tất cả sản phẩm khỏi giỏ hàng thành công',
			};
			res.status(200).json(responseData);
		} else {
			res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
		}
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const getCartUser = async (req, res, next) => {
	try {
		const { userId } = req.params;

		const existingCart = await Cart.findOne({ user: userId });
		if (existingCart) {
			const responseData = {
				user: existingCart.user,
				cartItems: existingCart.cartItems,
				totalCart: calculateTotalCart(existingCart.cartItems),
			};

			res.status(200).json(responseData);
		} else {
			res.status(404).json({ message: 'No cart found for the user' });
		}
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};
