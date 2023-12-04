import joi from 'joi';
import httpError from 'http-errors';
import Collections from '../models/Collections.js';

export const getCollections = async (req, res, next) => {
	try {
		const filterData = req.query.id ? { _id: req.query.id } : {};
		const collections = await Collections.find(filterData).populate('list_product');
		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: collections,
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const createCollectionsController = async (req, res, next) => {
	try {
		const productValidationSchema = joi.object({
			collections_name: joi.string().required(),
		});

		const validatedData = await productValidationSchema.validateAsync(req.body);

		if (!validatedData.collections_name) {
			return next(httpError(400, 'The input is required'));
		}
		const existingType = await Collections.findOne({ collections_name: validatedData.collections_name });
		if (existingType) return next(httpError(400, 'Collections Name already exists'));

		const collections = await Collections.create(validatedData);
		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: collections,
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const deleteCollectionsController = async (req, res, next) => {
	try {
		const id = req.query.id;
		const result = await Collections.deleteById({ _id: id });
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
