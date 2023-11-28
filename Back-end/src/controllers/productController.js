import joi from 'joi';
import httpError from 'http-errors';
import Product from '../models/Product.js';

export const getProduct = async (req, res, next) => {
	try {
		const filterData = req.query.id ? { _id: req.query.id } : {};
		const product = await Product.find(filterData);
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

export const createProduct = async (req, res, next) => {
	try {
		const productValidationSchema = joi.object({
			name: joi.string().required(),
			image: joi.string().required(),
			price: joi.number(),
			description: joi.string(),
			collections_id: joi.string(),
		});

		const validatedData = await productValidationSchema.validateAsync(req.body);

		if (
			!validatedData.name ||
			!validatedData.image ||
			!validatedData.price ||
			!validatedData.description ||
			!validatedData.collections_id
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
	} catch (error) {
		console.log(error);
		return next(httpError(500, error));
	}
};
