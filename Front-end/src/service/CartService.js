import axios from 'axios';
axios.defaults.withCredentials = true;

export const addToCart = async ({ cartItem, userId }) => {
	try {
		const response = await axios.post(`${process.env.REACT_APP_API_URL}/cart/create`, { cartItem, userId });
		return response.data;
	} catch (error) {
		console.error('Lỗi khi thêm vào giỏ hàng:', error);
		throw error;
	}
};

export const removeFromCart = async ({ idProduct, userId }) => {
	try {
		console.log(idProduct);
		const response = await axios.post(`${process.env.REACT_APP_API_URL}/cart/remove`, { idProduct, userId });
		return response.data;
	} catch (error) {
		console.error('Lỗi khi xoá khỏi giỏ hàng:', error);
		throw error;
	}
};

export const removeAllFromCart = async ({ listChecked, userId }) => {
	try {
		const response = await axios.post(`${process.env.REACT_APP_API_URL}/cart/removeAll`, { listChecked, userId });

		return response.data;
	} catch (error) {
		console.error('Lỗi khi xoá tất cả khỏi giỏ hàng:', error);
		throw error;
	}
};

export const getCartUser = async (userId) => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_API_URL}/cart/getCartUser/${userId}`);

		return response.data;
	} catch (error) {
		console.error('Lỗi không thể lấy giỏ hàng:', error);
		throw error;
	}
};
