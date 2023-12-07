import axios from 'axios';
axios.defaults.withCredentials = true;

export const axiosJWTC = axios.create();
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

// get all or get with id query, exercise: product/?id=65661792bfbb244758e8dbf7
export const getProduct = async (id) => {
	try {
		let res;
		if (!id) {
			res = await axiosJWTC.get(`${process.env.REACT_APP_API_URL}/product`);
		} else {
			res = await axiosJWTC.get(`${process.env.REACT_APP_API_URL}/product/?id=${id}`);
		}

		return res.data;
	} catch (error) {
		return error?.response;
	}
};

// get all or get with id query,exercise: product/collections?id=65661792bfbb244758e8dbf7
export const getCollectionProduct = async (id) => {
	try {
		let res;
		if (!id) {
			res = await axiosJWTC.get(`${process.env.REACT_APP_API_URL}/product/collections`);
		} else {
			res = await axiosJWTC.get(`${process.env.REACT_APP_API_URL}/product/collections/?id=${id}`);
		}

		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const createProduct = async (data) => {
	try {
		const res = await axiosJWTC.post(`${process.env.REACT_APP_API_URL}/product/create`, data);
		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const createCollection = async (data) => {
	try {
		const res = await axiosJWTC.post(`${process.env.REACT_APP_API_URL}/product/collections`, data);
		return res.data;
	} catch (error) {
		return error?.response;
	}
};