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
