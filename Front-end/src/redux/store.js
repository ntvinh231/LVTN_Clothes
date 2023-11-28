import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slice/counterSlide';
import userReducer from './slice/userSlide';

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		user: userReducer,
	},
});
