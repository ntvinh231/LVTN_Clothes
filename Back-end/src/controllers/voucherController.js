import joi from 'joi';
import httpError from 'http-errors';
import apq from 'api-query-params';
import Voucher from '../models/Voucher.js';

export const createVoucher = async (req, res, next) => {
	try {
		const { voucherCode, totalAmount, discountAmount } = req.body;
		const uppercasedVoucherCode = voucherCode.toUpperCase();

		if (Number(totalAmount) < 1000 || Number(discountAmount) < 1000) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Tổng tiền và tiền giảm giá phải từ 1000 trở lên',
			});
		}

		if (Number(totalAmount) < Number(discountAmount)) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Tổng tiền phải lớn hơn hoặc bằng tiền giảm giá',
			});
		}

		const voucher = await Voucher.findOne({ voucherCode: uppercasedVoucherCode });

		if (voucher) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Mã giảm giá đã tồn tại',
			});
		}

		const data = await Voucher.create({
			voucherCode: uppercasedVoucherCode,
			totalAmount,
			discountAmount,
		});

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: data,
			message: 'Tạo thành công mã giảm giá',
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const updateVoucher = async (req, res, next) => {
	try {
		const id = req.params.id;
		let { voucherCode, totalAmount, discountAmount } = req.body;

		if (!voucherCode) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'The voucherCode field is required',
			});
		}

		voucherCode = voucherCode.toUpperCase();

		if (Number(totalAmount) < 1000 || Number(discountAmount) < 1000) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Tổng tiền và tiền giảm giá phải từ 1000 trở lên',
			});
		}

		if (Number(totalAmount) < Number(discountAmount)) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Tổng tiền phải lớn hơn hoặc bằng tiền giảm giá',
			});
		}

		const existingVoucher = await Voucher.findOne({
			voucherCode: voucherCode,
			_id: { $ne: id },
		});

		if (existingVoucher) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Mã giảm giá đã tồn tại. Vui lòng thay đổi.',
			});
		}

		const checkVoucher = await Voucher.findOne({
			_id: id,
		});

		if (checkVoucher == null) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The voucher is not defined',
			});
		}

		let result = await Voucher.findByIdAndUpdate(
			id,
			{
				$set: {
					voucherCode, // Sử dụng giá trị đã chuyển đổi
					totalAmount,
					discountAmount,
				},
			},
			{
				new: true,
				runValidators: true,
			}
		);
		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: result,
		});
	} catch (error) {
		console.log(error);
		return next(httpError(500, error));
	}
};

export const getVoucher = async (req, res, next) => {
	let voucher;
	try {
		if (req.query.voucherCode) {
			req.query.voucherCode = req.query.voucherCode.toUpperCase();
			voucher = await Voucher.findOne({ voucherCode: req.query.voucherCode });
			if (!voucher) {
				return res.status(200).json({
					statusCode: 400,
					statusMessage: 'failed',
					message: 'Mã giảm giá không tồn tại',
				});
			}
			if (req.query.totalPrice < voucher.totalAmount) {
				return res.status(200).json({
					statusCode: 400,
					statusMessage: 'failed',
					statusMessageDetail: 'enough',
					message: `Mã giảm giá ${req.query.voucherCode} không khả dụng`,
				});
			}
		} else {
			voucher = await Voucher.find({});
			if (!voucher) {
				return res.status(200).json({
					statusCode: 400,
					statusMessage: 'failed',
					message: 'Mã giảm giá không tồn tại',
				});
			}
		}

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: voucher,
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const getVoucherById = async (req, res, next) => {
	try {
		const voucher = await Voucher.findById(req.params.id);
		if (!voucher) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Mã giảm giá không tồn tại',
			});
		}

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: voucher,
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const deleteVoucher = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id) {
			return res.status(200).json({
				statusCode: 200,
				statusMessage: 'failed',
				message: 'VoucherId là bắt buộc',
			});
		}
		const checkVoucher = await Voucher.findOne({
			_id: id,
		});
		if (checkVoucher == null) {
			return res.status(404).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The voucher is not defined',
			});
		}
		const result = await Voucher.deleteById({ _id: id });
		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: result,
		});
	} catch (error) {
		console.log(error);
		return next(httpError(500, error));
	}
};

export const deleteManyVoucher = async (req, res, next) => {
	try {
		const { ids } = req.body;

		if (!ids) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'The voucher is required',
			});
		}

		let result = await Voucher.delete({ _id: { $in: ids } });

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: result,
		});
	} catch (error) {
		console.log(error);
		return next(httpError(500, error));
	}
};
