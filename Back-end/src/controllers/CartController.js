import httpError from 'http-errors';
import Cart from '../models/Cart.js';
import Colors from '../models/Color.js';

const calculateTotalCart = (cartItems) => {
	return cartItems.reduce((total, item) => total + item.amount, 0);
};

export const createCart = async (req, res, next) => {
	try {
		const { cartItem, userId } = req.body;
		let existingCart = await Cart.findOne({ user: userId }).select('-image');

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
			existingCart.cartItems = existingCart.cartItems.filter((item) => {
				// Kiểm tra xem item.product và item.product.toString có tồn tại
				return item.product && item.product.toString() !== idProduct;
			});

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

			await Promise.all(
				existingCart.cartItems.map(async (cart) => {
					const colorDocument = await Colors.findOne({ _id: cart.colors_id });
					const color = colorDocument ? colorDocument.color : null;

					// Bổ sung trường color vào mỗi phần tử của cartItems
					cart.color = color;
				})
			);

			res.status(200).json(responseData);
		} else {
			const responseData = {
				user: '',
				cartItems: [],
				totalCart: 0,
			};
			res.status(200).json(responseData);
		}
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const decreaseAmountCart = async (req, res, next) => {
	try {
		await updateCart(req, res, next, -1);
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const increaseAmountCart = async (req, res, next) => {
	try {
		await updateCart(req, res, next, 1);
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

const updateCart = async (req, res, next, amountModifier) => {
	try {
		const { idProduct, userId } = req.body;
		const validAmountModifier = amountModifier === 1 ? 1 : -1; // Nếu là increase thì validAmountModifier là 1, ngược lại là -1
		let existingCart = await Cart.findOne({ user: userId });

		if (existingCart && existingCart.cartItems) {
			const existingProduct = existingCart.cartItems.find((p) => p.product.toString() === idProduct);

			if (existingProduct) {
				// Nếu sản phẩm tồn tại trong giỏ hàng, thì tăng/giảm số lượng
				existingProduct.amount = Math.max(existingProduct.amount + validAmountModifier, 1); // Đảm bảo amount không nhỏ hơn 1

				await existingCart.save();

				const responseData = {
					cartItems: existingCart.cartItems,
					totalCart: calculateTotalCart(existingCart.cartItems),
					message: 'Cập nhật giỏ hàng thành công',
				};
				return res.status(200).json(responseData);
			}
		}

		// Nếu sản phẩm không tồn tại trong giỏ hàng hoặc không tìm thấy giỏ hàng, trả về thông báo lỗi.
		return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};
