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
			//getAll
			res = await axios.get(`${process.env.REACT_APP_API_URL}/product`);
		} else {
			//getDetails
			res = await axios.get(`${process.env.REACT_APP_API_URL}/product/?id=${id}`);
		}

		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const getProductAdmin = async (id) => {
	try {
		let res;
		if (!id) {
			//getAll
			res = await axiosJWTC.get(`${process.env.REACT_APP_API_URL}/product/admin`);
		} else {
			//getDetails
			res = await axiosJWTC.get(`${process.env.REACT_APP_API_URL}/product/admin/?id=${id}`);
		}

		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const getNameCollection = async (collection) => {
	try {
		const res = await axiosJWTC.get(
			`${process.env.REACT_APP_API_URL}/product/collections?collections_name=${collection}`
		);

		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const getProductCollection = async (page, limit, id) => {
	try {
		let res;
		if (!id) {
			//getAll
			res = await axiosJWTC.get(`${process.env.REACT_APP_API_URL}/product?page=${page}&limit=${limit}`);
		} else {
			//getOne
			res = await axiosJWTC.get(
				`${process.env.REACT_APP_API_URL}/product?page=${page}&limit=${limit}&collections_id=${id}`
			);
		}

		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const getProductSearch = async (search, limit) => {
	try {
		let res;
		if (!(search?.length > 0)) {
			//getAll
			res = await axios.get(`${process.env.REACT_APP_API_URL}/product?limit=${limit}`);
		} else {
			//getDataSearch
			res = await axios.get(`${process.env.REACT_APP_API_URL}/product?name=/${search}/i`);
		}

		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const getCollectionProduct = async (id) => {
	try {
		let res;
		if (!id) {
			//getDetails
			res = await axiosJWTC.get(`${process.env.REACT_APP_API_URL}/product/collections`);
		} else {
			//getOne
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
export const updateProduct = async (id, data) => {
	try {
		const res = await axiosJWTC.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`, data);
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

export const deleteProduct = async (id) => {
	try {
		const res = await axiosJWTC.delete(`${process.env.REACT_APP_API_URL}/product/delete/${id}`);
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

export const deleteManyProduct = async (data) => {
	try {
		const res = await axiosJWTC.delete(`${process.env.REACT_APP_API_URL}/product/delete-many`, { data });
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

export const getAllCollections = async (id) => {
	try {
		let res;
		if (id) {
			//getOne
			res = await axiosJWTC.get(`${process.env.REACT_APP_API_URL}/product/collections?id=${id}`);
		} else {
			//GetDetails
			res = await axiosJWTC.get(`${process.env.REACT_APP_API_URL}/product/collections`);
		}
		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const deleteCollection = async (id) => {
	try {
		const res = await axiosJWTC.delete(`${process.env.REACT_APP_API_URL}/product/collections?id=${id}`);
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

export const updateCollection = async (id, data) => {
	try {
		const res = await axiosJWTC.put(`${process.env.REACT_APP_API_URL}/product/collections/${id}`, data);
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

export const checkProductDetails = async (data) => {
	try {
		const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/checkProductDetails`, data);
		return res.data;
	} catch (error) {
		return error?.response;
	}
};

//Deletemany collection
export const deleteManyCollection = async (data) => {
	try {
		const res = await axiosJWTC.delete(`${process.env.REACT_APP_API_URL}/product/collection-many`, { data });
		return res.data;
	} catch (error) {
		console.log(error);
	}
};
