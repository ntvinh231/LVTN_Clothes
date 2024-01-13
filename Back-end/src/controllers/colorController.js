import joi from 'joi';
import httpError from 'http-errors';
import apq from 'api-query-params';
import Colors from '../models/Color.js';
import Product from '../models/Product.js';

export const getColors = async (req, res, next) => {
	try {
		let page = req.query.page;
		const { filter, limit, sort } = apq(req.query);
		delete filter.page;
		const filterData = filter.id ? { _id: filter.id } : filter;
		const filterData2 =
			filterData?.color && filter.color ? { color: { $regex: new RegExp(`^${filter.color}$`, 'i') } } : filterData;
		const offset = limit * (page - 1);
		const colors = await Colors.find(filterData2).limit(limit).skip(offset).sort(sort).populate({
			path: 'list_product',
			select: '-image',
		});

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: colors,
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const createColorsController = async (req, res, next) => {
	try {
		const ValidationSchema = joi.object({
			color: joi.string().required(),
		});

		const validatedData = await ValidationSchema.validateAsync(req.body);

		if (!validatedData.color) {
			return next(httpError(400, 'The input is required'));
		}
		const existingType = await Colors.findOne({ color: validatedData.color });
		if (existingType)
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Màu đã tồn tại',
			});

		const color = await Colors.create(validatedData);
		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: color,
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const deleteColorsController = async (req, res, next) => {
	try {
		const id = req.query.id;

		const color = await Colors.findOne({ _id: id }).populate('list_product');
		const checkExists = color?.list_product.length > 0;
		if (checkExists) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Không thể xóa màu có hiện đang có ít nhất một sản phẩm',
			});
		}
		const result = await Colors.deleteById({ _id: id });

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: result,
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const updateColors = async (req, res, next) => {
	try {
		const id = req.params.id;
		const { color } = req.body;

		if (!color) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'The color field is required',
			});
		}

		const existingColor = await Colors.findOne({
			color: color,
			_id: { $ne: id },
		});

		if (existingColor) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Màu đã tồn tại.Vui lòng thay đổi màu khác',
			});
		}

		const checkColors = await Colors.findOne({
			_id: id,
		});

		if (checkColors == null) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The color is not defined',
			});
		}

		let result = await Colors.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});

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

export const deleteManyColors = async (req, res, next) => {
	try {
		const { ids } = req.body;

		if (!ids) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'The color is required',
			});
		}

		for (const id of ids) {
			const color = await Colors.findOne({ _id: id }).populate('list_product');
			const checkExists = color?.list_product.length > 0;
			if (checkExists) {
				return res.status(200).json({
					statusCode: 400,
					statusMessage: 'failed',
					message: 'Không thể xóa màu có hiện đang có ít nhất một sản phẩm',
				});
			}
		}
		let result = await Colors.delete({ _id: { $in: ids } });

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

export const getAllColorOfProduct = async (req, res, next) => {
	try {
		const conditions = {
			name: req.body.name,
			collections_id: req.body.collections_id,
		};
		const result = await Product.distinct('colors_id', conditions);

		const dataResult = [];
		for (const id of result) {
			const dataColor = await Colors.findById(id);

			dataResult.push({
				id: dataColor._id,
				name: dataColor.color,
			});
		}

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: dataResult,
		});

		// Tiếp tục xử lý dữ liệu nếu cần
	} catch (error) {
		console.error('Error in finding data:', error);
		// Xử lý lỗi nếu cần
	}
};
