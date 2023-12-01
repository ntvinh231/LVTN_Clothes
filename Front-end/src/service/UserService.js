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

export const registerUser = async (data) => {
	try {
		const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/signup`, data);

		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const getDetailsUser = async (id, accessToken) => {
	try {
		const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/details/${id}`);

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

export const loggoutUser = async () => {
	try {
		const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/loggout`);
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

export const updateUser = async (data) => {
	try {
		const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/user/update`, data);
		return res.data;
	} catch (error) {
		console.log(error);
	}
};
