import joi from 'joi';
import httpError from 'http-errors';
import Collections from '../models/Collections.js';
import apq from 'api-query-params';

export const getCollections = async (req, res, next) => {
	try {
		let page = req.query.page;
		const { filter, limit, sort } = apq(req.query);
		delete filter.page;
		const filterData = filter.id ? { _id: filter.id } : filter;
		const filterData2 =
			filterData?.collections_name && filter.collections_name
				? { collections_name: { $regex: new RegExp(`^${filter.collections_name}$`, 'i') } }
				: filterData;
		const offset = limit * (page - 1);
		const collections = await Collections.find(filterData2).limit(limit).skip(offset).sort(sort).populate({
			path: 'list_product',
			select: '-image',
		});

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
		const ValidationSchema = joi.object({
			collections_name: joi.string().required(),
		});

		const validatedData = await ValidationSchema.validateAsync(req.body);

		if (!validatedData.collections_name) {
			return next(httpError(400, 'The input is required'));
		}
		const existingType = await Collections.findOne({ collections_name: validatedData.collections_name });
		if (existingType)
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Tên loại sản phẩm đã tồn tại',
			});

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

		const collection = await Collections.findOne({ _id: id }).populate('list_product');
		const checkExists = collection?.list_product.length > 0;
		if (checkExists) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Không thể xóa collection có hiện đang có ít nhất một sản phẩm',
			});
		}
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

export const updateCollection = async (req, res, next) => {
	try {
		const id = req.params.id;
		const { collections_name } = req.body;

		if (!collections_name) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'The collections name field is required',
			});
		}

		const existingCollection = await Collections.findOne({
			collections_name: collections_name,
			_id: { $ne: id },
		});

		if (existingCollection) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Tên collection đã tồn tại.Vui lòng thay đổi tên',
			});
		}

		const checkCollections = await Collections.findOne({
			_id: id,
		});

		if (checkCollections == null) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The collection is not defined',
			});
		}

		let result = await Collections.findByIdAndUpdate(id, req.body, {
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

export const deleteManyCollection = async (req, res, next) => {
	try {
		const { ids } = req.body;

		if (!ids) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'The collection is required',
			});
		}

		for (const id of ids) {
			const collection = await Collections.findOne({ _id: id }).populate('list_product');
			const checkExists = collection?.list_product.length > 0;
			if (checkExists) {
				return res.status(200).json({
					statusCode: 400,
					statusMessage: 'failed',
					message: 'Không thể xóa collection có hiện đang có ít nhất một sản phẩm',
				});
			}
		}
		let result = await Collections.delete({ _id: { $in: ids } });

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
