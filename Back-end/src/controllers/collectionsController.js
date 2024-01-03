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

		const collection = await Collections.findOne({ _id: id }).populate('list_product');
		const checkProductExists = collection.list_product.length > 0;
		if (checkProductExists) {
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
		if (!id) {
			return res.status(200).json({
				statusCode: 200,
				statusMessage: 'failed',
				message: 'The collections is required',
			});
		}
		const checkCollections = await Collections.findOne({
			_id: id,
		});
		if (checkCollections == null) {
			return res.status(404).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The collections is not defined',
			});
		}
		let result = await Collections.findByIdAndUpdate(id, req.body, {
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
