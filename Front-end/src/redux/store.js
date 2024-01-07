import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slice/productSlide';
import userReducer from './slice/userSlide';
import checkProductProducer from './slice/checkProductSlide';
import cartReducer from './slice/cartSlide';

export const store = configureStore({
	reducer: {
		product: productReducer,
		user: userReducer,
		checkProduct: checkProductProducer,
		cart: cartReducer,
	},
});
