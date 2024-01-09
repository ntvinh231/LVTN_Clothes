import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	name: '',
	email: '',
	phone: '',
	address: '',
	city: '',
	avatar: '',
	id: '',
	accessToken: '',
	role: 'user',
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
				city = '',
				avatar = '',
				_id = '',
				accessToken = '',
				role = '',
			} = action.payload;

			state.name = name;
			state.email = email;
			state.phone = phone;
			state.address = address;
			state.city = city;
			state.avatar = avatar;
			state.id = _id;
			state.accessToken = accessToken;
			state.role = role;
		},
		// Loggout
		resetUser: (state) => {
			state.name = '';
			state.email = '';
			state.phone = '';
			state.address = '';
			state.city = '';
			state.avatar = '';
			state.id = '';
			state.accessToken = '';
			state.role = 'user';
		},
	},
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions;

export default userSlide.reducer;
