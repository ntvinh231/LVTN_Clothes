import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	cartItems: [],
	cartItemsSelected: [],
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
		selectedCart: (state, action) => {
			const { listChecked } = action.payload;
			const cartSelected = [];
			state.cartItems.forEach((cart) => {
				if (listChecked.includes(cart.product)) {
					cartSelected.push(cart);
				}
			});
			state.cartItemsSelected = cartSelected;
		},
	},
});

// Action creators are generated for each case reducer function
export const { addCart, inCreaseAmount, deCreaseAmount, removeCart, removeAllCart, selectedCart } = cartSlide.actions;

export default cartSlide.reducer;
