import { axiosJWT } from './UserService';
axiosJWT.defaults.withCredentials = true;

export const addToCart = async ({ cartItem, userId }) => {
	try {
		const response = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/cart/create`, { cartItem, userId });
		return response.data;
	} catch (error) {
		console.error('Lỗi khi thêm vào giỏ hàng:', error);
		throw error;
	}
};

export const removeFromCart = async ({ idProduct, userId }) => {
	try {
		console.log(idProduct);
		const response = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/cart/remove`, { idProduct, userId });
		return response.data;
	} catch (error) {
		console.error('Lỗi khi xoá khỏi giỏ hàng:', error);
		throw error;
	}
};

export const removeAllFromCart = async ({ listChecked, userId }) => {
	try {
		const response = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/cart/removeAll`, { listChecked, userId });

		return response.data;
	} catch (error) {
		console.error('Lỗi khi xoá tất cả khỏi giỏ hàng:', error);
		throw error;
	}
};

export const getCartUser = async (userId) => {
	try {
		const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/cart/getCartUser/${userId}`);

		return response.data;
	} catch (error) {
		console.error('Lỗi không thể lấy giỏ hàng:', error);
		throw error;
	}
};

export const increaseAmount = async ({ idProduct, userId }) => {
	try {
		const response = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/cart/increaseAmount`, {
			idProduct,
			userId,
		});
		return response.data;
	} catch (error) {
		console.error('Lỗi khi tăng số lượng sản phẩm trong giỏ hàng:', error);
		throw error;
	}
};

export const decreaseAmount = async ({ idProduct, userId }) => {
	try {
		const response = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/cart/decreaseAmount`, {
			idProduct,
			userId,
		});
		return response.data;
	} catch (error) {
		console.error('Lỗi khi giảm số lượng sản phẩm trong giỏ hàng:', error);
		throw error;
	}
};
