import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	name: '',
	email: '',
	accessToken: '',
};

export const userSlide = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// Login
		updateUser: (state, action) => {
			const { name, email, accessToken } = action.payload;
			state.name = name || email;
			state.email = email;
			state.accessToken = accessToken;
		},
		// Loggout
		resetUser: (state) => {
			state.name = '';
			state.email = '';
			state.accessToken = '';
		},
	},
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions;

export default userSlide.reducer;
