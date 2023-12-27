import joi from 'joi';
import httpError from 'http-errors';
import Product from '../models/Product.js';
import apq from 'api-query-params';

export const getProduct = async (req, res, next) => {
	try {
		let page = req.query.page;
		const { filter, limit, sort } = apq(req.query);
		delete filter.page;
		const totalProduct = await Product.count();
		const filterData = filter.id ? { _id: filter.id } : filter;
		const offset = limit * (page - 1);
		const product = await Product.find(filterData).limit(limit).skip(offset).sort(sort);
		const totalResultProduct = product?.length;
		if (filter.id && product.length === 0) {
			return res.status(404).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The product is not defined',
			});
		}

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: product,
			totalProduct,
			totalPage: Math.ceil(totalProduct / limit),
			totalResult: Math.ceil(totalResultProduct / limit),
			currentPage: page,
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const createProduct = async (req, res, next) => {
	try {
		const productValidationSchema = joi.object({
			name: joi.string().required(),
			image: joi.string().required(),
			price: joi.number(),
			size: joi.string(),
			quantity: joi.string(),
			description: joi.string(),
			collections_id: joi.string(),
			discount: joi.number(),
		});

		const validatedData = await productValidationSchema.validateAsync(req.body);

		if (
			!validatedData.name ||
			!validatedData.image ||
			!validatedData.price ||
			!validatedData.description ||
			!validatedData.collections_id ||
			!validatedData.size ||
			!validatedData.quantity
		) {
			return next(httpError(400, 'The input is required'));
		}
		const existingProduct = await Product.findOne({ name: validatedData.name });
		if (existingProduct) return next(httpError(400, 'Name product already exists'));

		const product = await Product.create(validatedData);
		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: product,
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const updateProduct = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id) {
			return res.status(200).json({
				statusCode: 200,
				statusMessage: 'failed',
				message: 'The product is required',
			});
		}
		const checkProduct = await Product.findOne({
			_id: id,
		});
		if (checkProduct == null) {
			return res.status(404).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The product is not defined',
			});
		}
		let result = await Product.findByIdAndUpdate(id, req.body, {
			new: true, // trả về dữ liệu mới sau khi cập nhật thay vì dữ liệu cũ
			runValidators: true, // bảo rằng dữ liệu mới cập nhật đáp ứng ràng buộc trong model .
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

export const deleteProduct = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id) {
			return res.status(200).json({
				statusCode: 200,
				statusMessage: 'failed',
				message: 'The product is required',
			});
		}
		const checkProduct = await Product.findOne({
			_id: id,
		});
		if (checkProduct == null) {
			return res.status(404).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The product is not defined',
			});
		}
		const result = await Product.deleteById({ _id: id });
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

export const deleteManyProduct = async (req, res, next) => {
	try {
		const { ids } = req.body;

		if (!ids) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'The product is required',
			});
		}

		let result = await Product.delete({ _id: { $in: ids } });

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
