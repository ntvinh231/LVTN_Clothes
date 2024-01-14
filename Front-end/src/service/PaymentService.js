import axios from 'axios';

export const getConfig = async () => {
	try {
		const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment/config`);
		return res.data;
	} catch (error) {
		return error?.response;
	}
};
