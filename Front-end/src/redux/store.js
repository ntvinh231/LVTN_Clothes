import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slice/productSlide';
import userReducer from './slice/userSlide';
import checkProductProducer from './slice/checkProductSlide';

export const store = configureStore({
	reducer: {
		product: productReducer,
		user: userReducer,
		checkProduct: checkProductProducer,
	},
});
