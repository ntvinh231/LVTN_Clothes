import axios from 'axios';

axios.defaults.withCredentials = true;
export const axiosJWT = axios.create();

export const loginUser = async (data) => {
	try {
		const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/signin`, data);

		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const registerUserTemp = async (data) => {
	try {
		const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/signup-temp`, data);

		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const registerUser = async (data) => {
	try {
		const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/signup`, data);

		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const getDetailsUser = async (id) => {
	try {
		const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/details/${id}`);

		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const getAllUser = async () => {
	try {
		const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/getAll`);

		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const refreshToken = async () => {
	try {
		const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`, {
			withCredentials: true,
		});
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

export const forgotPassword = async (email, frontendHost) => {
	try {
		const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/forgot-password`, { email, frontendHost });
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

export const resetPassword = async (data, token) => {
	try {
		const res = await axios.patch(`${process.env.REACT_APP_API_URL}/user/reset-password/${token}`, data);
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

export const loggoutUser = async () => {
	try {
		const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/user/loggout`);
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

//ForUser
export const updateUser = async (data) => {
	try {
		const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/user/update`, data);
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

//Change password
export const updatePassword = async (data) => {
	try {
		const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/user/updatePassword`, data);

		return res.data;
	} catch (error) {
		return error?.response;
	}
};

//ForAdmin
export const updateUserForAdmin = async (id, data) => {
	try {
		const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/user/updateForAdmin/${id}`, data);
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

export const deleteUser = async (id) => {
	try {
		const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/user/delete/${id}`);
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

export const deleteManyUser = async (data) => {
	try {
		const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/user/delete-many`, { data });
		return res.data;
	} catch (error) {
		console.log(error);
	}
};
