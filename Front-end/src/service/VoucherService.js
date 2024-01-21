import { axiosJWT } from './UserService';
axiosJWT.defaults.withCredentials = true;

export const createVoucher = async (data) => {
	try {
		const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/voucher/create-voucher`, data);
		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const updateVoucher = async (id, data) => {
	try {
		const res = await axiosJWT.patch(`${process.env.REACT_APP_API_URL}/voucher/update/${id}`, data);
		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const getVoucher = async ({ stateVoucherCode, totalPrice }) => {
	let res;
	try {
		if (stateVoucherCode) {
			res = await axiosJWT.get(
				`${process.env.REACT_APP_API_URL}/voucher/voucher?voucherCode=${stateVoucherCode}&totalPrice=${totalPrice}`
			);
		} else {
			res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/voucher/voucher`);
		}
		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const getAllVoucher = async () => {
	let res;
	try {
		res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/voucher/voucher`);
		return res.data;
	} catch (error) {
		return error?.response;
	}
};
export const deleteVoucher = async (id) => {
	try {
		const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/voucher/delete/${id}`);
		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const getVoucherByAdmin = async (id) => {
	try {
		const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/voucher/voucher/${id}`);
		return res.data;
	} catch (error) {
		return error?.response;
	}
};

export const deleteManyVoucher = async (data) => {
	try {
		const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/voucher/delete-many`, { data });
		return res.data;
	} catch (error) {
		console.log(error);
	}
};
