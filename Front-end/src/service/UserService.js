import axios from 'axios';
axios.defaults.withCredentials = true; //Dùng cookies cần có
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
		const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/details/${id}`);

		return res.data;
	} catch (error) {
		return error?.response;
	}
};
