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

export const deleteOrder = async (id, orderItems, userId) => {
	try {
		// Thay đổi cách gọi API để truyền dữ liệu qua body
		const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/delete`, {
			orderId: id,
			orderItems: orderItems,
			userId,
			// Thêm các trường dữ liệu khác nếu cần
		});
		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const getOrderByAdmin = async (id) => {
	try {
		let res;
		const url = id
			? `${process.env.REACT_APP_API_URL}/order/get-all-order/?id=${id}`
			: `${process.env.REACT_APP_API_URL}/order/get-all-order`;
		res = await axiosJWT.get(url);
		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const updateDetailsOrderByAdmin = async (rowSelected, isDelivered, isPaid) => {
	try {
		const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/update-details-order`, {
			id: rowSelected,
			isDelivered,
			isPaid,
		});
		return res.data;
	} catch (error) {
		return error?.response;
	}
};
