import { axiosJWT } from './UserService';
axiosJWT.defaults.withCredentials = true;

export const getConfig = async () => {
	try {
		const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/payment/config`);
		return res.data;
	} catch (error) {
		return error?.response;
	}
};
