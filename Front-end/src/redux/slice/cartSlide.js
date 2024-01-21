import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as CartService from '../../service/CartService';
import * as Message from '../../components/Message/Message';
import { resetUser } from './userSlide';
import { useDispatch } from 'react-redux';

const initialState = {
	cartItems: [],
	cartItemsSelected: [],
	totalCart: 0,
	user: '',
	isLoggedIn: false,
	isLoadingAddToCart: false,
	isLoadingGetCart: false,
	isLoadingRemoveCart: false,
	isLoadingRemoveAllCart: false,
};

export const addToCart = createAsyncThunk('/cart/create', async ({ cartItem }, { getState }) => {
	const { user } = getState();
	const userId = user.id;
	if (user?.id) {
		const response = await CartService.addToCart({ cartItem, userId });
		Message.success(response.message);
		return response;
	} else {
		// console.log({ cartItem });
		// return { cartItem };
	}
});

export const removeAllFromCart = createAsyncThunk('cart/removeAll', async ({ listChecked }, { getState }) => {
	const { user } = getState();
	const userId = user.id;

	if (user?.id) {
		const response = await CartService.removeAllFromCart({ listChecked, userId });
		// Message.success(response.message);
		return response;
	} else {
		// console.log({ listChecked });
		// return { listChecked };
	}
});
export const removeFromCart = createAsyncThunk('cart/remove', async ({ idProduct }, { getState }) => {
	const { user } = getState();
	const userId = user.id;

	if (user?.id) {
		const response = await CartService.removeFromCart({ idProduct, userId });
		Message.success(response.message);
		return response;
	} else {
		// console.log({ idProduct });
		// return { idProduct };
	}
});
export const decreaseAmountAsync = createAsyncThunk('cart/decreaseAmountAsync', async ({ idProduct }, { getState }) => {
	const { user } = getState();
	const userId = user.id;

	if (user?.id) {
		const response = await CartService.decreaseAmount({ idProduct, userId });
		Message.success(response.message);
		return response;
	} else {
		// Xử lý khi user không tồn tại
		return { error: 'User not found' };
	}
});
export const increaseAmountAsync = createAsyncThunk('cart/increaseAmountAsync', async ({ idProduct }, { getState }) => {
	const { user } = getState();
	const userId = user.id;

	if (user?.id) {
		const response = await CartService.increaseAmount({ idProduct, userId });
		Message.success(response.message);
		return response;
	} else {
		// Xử lý khi user không tồn tại
		return { error: 'User not found' };
	}
});

export const getCartUser = createAsyncThunk('cart/getCartUser', async (userId, { getState }) => {
	const { user } = getState();

	if (user?.id) {
		const response = await CartService.getCartUser(user?.id);
		return response;
	} else {
		// Xử lý khi không có user.id
	}
});

export const cartSlide = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addCart: (state, action) => {
			const { cartItem } = action.payload;
			const foundItem = state.cartItems.find((item) => item.product === cartItem.product);

			if (foundItem) {
				foundItem.amount += cartItem?.amount;
			} else {
				state?.cartItems.push(cartItem);
			}

			// Tính tổng số lượng trong giỏ hàng sau mỗi lần thêm sản phẩm
			const totalQuantity = state?.cartItems?.reduce((total, item) => total + item.amount, 0);
			// Cập nhật state với tổng số lượng mới
			state.totalCart = totalQuantity;
		},
		inCreaseAmount: (state, action) => {
			const { idProduct } = action.payload;
			const foundItem = state?.cartItems?.find((item) => item.product === idProduct);
			const itemCartSelected = state?.cartItemsSelected?.find((item) => item?.product === idProduct);
			foundItem.amount++;
			if (itemCartSelected) {
				itemCartSelected.amount++;
			}

			const totalQuantity = state?.cartItems?.reduce((total, item) => total + item.amount, 0);
			state.totalCart = totalQuantity;
		},
		deCreaseAmount: (state, action) => {
			const { idProduct } = action.payload;
			const foundItem = state?.cartItems?.find((item) => item.product === idProduct);
			const itemCartSelected = state?.cartItemsSelected?.find((item) => item?.product === idProduct);
			if (foundItem && foundItem.amount > 1) {
				foundItem.amount--;
			}
			if (itemCartSelected) {
				itemCartSelected.amount--;
			}

			const totalQuantity = state?.cartItems?.reduce((total, item) => total + item.amount, 0);

			state.totalCart = totalQuantity;
		},
		selectedCart: (state, action) => {
			const { listChecked } = action.payload;

			const cartSelected = [];
			state?.cartItems?.forEach((cart) => {
				if (listChecked?.includes(cart.product)) {
					cartSelected.push(cart);
				}
			});
			state.cartItemsSelected = cartSelected;
		},
		removeCart: (state, action) => {
			const { idProduct } = action.payload;

			// Kiểm tra xem state.cartItems có tồn tại và có phải là một mảng không
			if (state.cartItems && Array.isArray(state.cartItems)) {
				// Lọc các item tương ứng với id và tạo ra data mới loại bỏ item có idProduct
				const foundItem = state.cartItems.filter((item) => item.product !== idProduct);

				// Gán lại state.cartItems bằng mảng mới đã lọc
				state.cartItems = foundItem;

				// Tính tổng số lượng trong giỏ hàng sau mỗi lần xóa sản phẩm
				const totalQuantity = foundItem.reduce((total, item) => total + item.amount, 0);

				// Cập nhật state.totalCart với tổng số lượng mới
				state.totalCart = totalQuantity;
			}
		},
		removeAllCart: (state, action) => {
			const { listChecked } = action.payload;

			// Lọc ra các item không nằm trong listChecked để xóa
			const foundItem = state?.cartItems?.filter((item) => !listChecked.includes(item.product));

			// Gán lại state.cartItems bằng mảng mới đã lọc
			state.cartItems = foundItem;

			// Tính tổng số lượng trong giỏ hàng sau mỗi lần xóa sản phẩm
			const totalQuantity = foundItem?.reduce((total, item) => total + item.amount, 0);
			state.totalCart = totalQuantity;
		},

		setCart: (state, action) => {
			const { cartItems, totalCart } = action.payload;
			state.cartItems = cartItems;
			state.totalCart = totalCart;
		},
		resetCart: (state) => {
			state.cartItems = [];
			state.cartItemsSelected = [];
			state.isLoadingAddToCart = false;
			state.isLoadingGetCart = false;
			state.totalCart = 0;
			state.user = '';
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addToCart.pending, (state) => {
				state.isLoadingAddToCart = true;
			})
			.addCase(addToCart.fulfilled, (state, action) => {
				state.cartItems = action.payload.cartItems;
				state.totalCart = action.payload.totalCart;
				state.isLoadingAddToCart = false;
			})
			.addCase(addToCart.rejected, (state) => {
				state.isLoadingAddToCart = false;
			})
			.addCase(removeFromCart.pending, (state) => {
				state.isLoadingRemoveCart = true;
			})
			.addCase(removeFromCart.fulfilled, (state, action) => {
				state.cartItems = action.payload.cartItems;
				state.totalCart = action.payload.totalCart;
				state.isLoadingRemoveCart = false;
			})
			.addCase(removeFromCart.rejected, (state, action) => {
				// Xử lý khi có lỗi khi lấy dữ liệu giỏ hàng
				console.error('Error fetching cart:', action.error);
			})
			.addCase(removeAllFromCart.pending, (state) => {
				state.isLoadingRemoveAllCart = true;
			})
			.addCase(removeAllFromCart.fulfilled, (state, action) => {
				state.cartItems = action.payload.cartItems;
				state.totalCart = action.payload.totalCart;
				state.isLoadingRemoveAllCart = false;
			})
			.addCase(removeAllFromCart.rejected, (state, action) => {
				// Xử lý khi có lỗi khi lấy dữ liệu giỏ hàng
				console.error('Error fetching cart:', action.error);
			})
			.addCase(getCartUser.pending, (state) => {
				state.isLoadingGetCart = true;
			})
			.addCase(getCartUser.fulfilled, (state, action) => {
				if (action.payload) {
					if (action.payload?.statusCode === 401) {
						state.isLoggedIn = false;
						Message.error(action.payload?.message);
					} else {
						state.isLoggedIn = true;
					}
					state.cartItems = action.payload.cartItems;
					state.totalCart = action.payload.totalCart;
				}
				state.isLoadingRemoveCart = false;
				state.isLoadingRemoveAllCart = false;
				state.isLoadingGetCart = false;
			})
			.addCase(getCartUser.rejected, (state, action) => {
				// Xử lý khi có lỗi khi lấy dữ liệu giỏ hàng
				console.error('Error fetching cart:', action.error);
			})
			.addCase(increaseAmountAsync.fulfilled, (state, action) => {
				if (action.payload) {
					state.cartItems = action.payload.cartItems;
					state.totalCart = action.payload.totalCart;
					// Kiểm tra state.cartItems.amount có tồn tại hay không trước khi sử dụng
					if (state.cartItems && state.cartItems.amount !== undefined) {
						state.cartItems.amount = action.payload.cartItems.amount;
					}
					state.isLoadingGetCart = false;
					state.isLoggedIn = false;
				}
			})
			.addCase(decreaseAmountAsync.fulfilled, (state, action) => {
				if (action.payload && action.payload.cartItems) {
					state.cartItems = action.payload.cartItems;
					state.totalCart = action.payload.totalCart;

					// Kiểm tra state.cartItems.amount có tồn tại hay không trước khi sử dụng
					if (state.cartItems && state.cartItems.amount !== undefined) {
						state.cartItems.amount = action.payload.cartItems.amount;
					}

					state.isLoadingGetCart = false;
				}
			});
	},
});

// Action creators are generated for each case reducer function
export const { addCart, inCreaseAmount, deCreaseAmount, removeCart, removeAllCart, selectedCart, setCart, resetCart } =
	cartSlide.actions;

export default cartSlide.reducer;
