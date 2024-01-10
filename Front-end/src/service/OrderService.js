import { axiosJWT } from './UserService';
axiosJWT.defaults.withCredentials = true;

export const createOrder = async (data) => {
	try {
		const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data);
		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const getOrderByUserId = async (id) => {
	try {
		const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/all-order/${id}`);
		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const getDetailsOrder = async (id) => {
	try {
		const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/order-details/${id}`);
		return res.data;
	} catch (error) {
		return error?.response;
	}
};
