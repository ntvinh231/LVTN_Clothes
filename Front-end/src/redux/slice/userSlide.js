import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	name: '',
	email: '',
	phone: '',
	address: '',
	avatar: '',
	id: '',
	accessToken: '',
};

export const userSlide = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// Login
		updateUser: (state, action) => {
			const {
				name = '',
				email = '',
				phone = '',
				address = '',
				avatar = '',
				_id = '',
				accessToken = '',
			} = action.payload;

			state.name = name;
			state.email = email;
			state.phone = phone;
			state.address = address;
			state.avatar = avatar;
			state.id = _id;
			state.accessToken = accessToken;
		},
		// Loggout
		resetUser: (state) => {
			state.name = '';
			state.email = '';
			state.phone = '';
			state.address = '';
			state.avatar = '';
			state.id = '';
			state.accessToken = '';
		},
	},
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions;

export default userSlide.reducer;
