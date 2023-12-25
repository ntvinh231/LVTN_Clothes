import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slice/productSlide';
import userReducer from './slice/userSlide';

export const store = configureStore({
	reducer: {
		product: productReducer,
		user: userReducer,
	},
});
