import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	statusCode: 200,
};

export const checkProductSlide = createSlice({
	name: 'checkProduct',
	initialState,
	reducers: {
		checkProduct: (state, action) => {
			state.statusCode = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { checkProduct } = checkProductSlide.actions;

export default checkProductSlide.reducer;
