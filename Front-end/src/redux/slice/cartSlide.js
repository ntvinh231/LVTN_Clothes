import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	cartItems: [],
	totalCart: null,
	user: '',
};

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
			foundItem.amount++;
			const totalQuantity = state?.cartItems?.reduce((total, item) => total + item.amount, 0);
			state.totalCart = totalQuantity;
		},
		deCreaseAmount: (state, action) => {
			const { idProduct } = action.payload;
			const foundItem = state?.cartItems?.find((item) => item.product === idProduct);
			if (foundItem && foundItem.amount > 1) {
				foundItem.amount--;
			}
			const totalQuantity = state?.cartItems?.reduce((total, item) => total + item.amount, 0);

			state.totalCart = totalQuantity;
		},
		removeCart: (state, action) => {
			const { idProduct } = action.payload;
			//Lọc các item tương ứng với id và tạo ra data mới loại bỏ item có idProduct
			//Tạo ra một data mới không có idProduct
			const foundItem = state?.cartItems?.filter((item) => item.product !== idProduct);
			state.cartItems = foundItem;
			const totalQuantity = state?.cartItems?.reduce((total, item) => total + item.amount, 0);

			state.totalCart = totalQuantity;
		},
		removeAllCart: (state, action) => {
			const { listChecked } = action.payload;
			const foundItem = state?.cartItems?.filter((item) => !listChecked.includes(item.product));
			state.cartItems = foundItem;
			const totalQuantity = state?.cartItems?.reduce((total, item) => total + item.amount, 0);
			state.totalCart = totalQuantity;
		},
	},
});

// Action creators are generated for each case reducer function
export const { addCart, inCreaseAmount, deCreaseAmount, removeCart, removeAllCart } = cartSlide.actions;

export default cartSlide.reducer;
