import joi from 'joi';
import httpError from 'http-errors';
import Product from '../models/Product.js';
import apq from 'api-query-params';

export const getProduct = async (req, res, next) => {
	try {
		let page = req.query.page;
		const { filter, limit, sort } = apq(req.query);
		delete filter.page;

		const filterData = filter.id ? { _id: filter.id } : filter;
		const offset = limit * (page - 1);
		const totalProductCount = await Product.countDocuments(filterData);
		const products = await Product.find(filterData).limit(limit).skip(offset).sort(sort);

		const uniqueProductsMap = {};
		products.forEach((product) => {
			const key = `${product.name}_${product.collections_id}`;
			if (!uniqueProductsMap[key]) {
				uniqueProductsMap[key] = product;
			}
		});

		const uniqueProducts = Object.values(uniqueProductsMap);

		if (filter.id && uniqueProducts.length === 0) {
			return res.status(404).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The product is not defined',
			});
		}

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: uniqueProducts,
			totalProduct: totalProductCount,
			totalPage: Math.ceil(totalProductCount / (limit || 10)),
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const getProductAdmin = async (req, res, next) => {
	try {
		let page = req.query.page;
		const { filter, limit, sort } = apq(req.query);
		delete filter.page;
		const filterData = filter.id ? { _id: filter.id } : filter;
		const offset = limit * (page - 1);
		const totalProductCount = await Product.countDocuments(filterData);
		const product = await Product.find(filterData).limit(limit).skip(offset).sort(sort);

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
			totalProduct: totalProductCount,
			totalPage: Math.ceil(totalProductCount / (limit || 10)),
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

		if (req.body.size && !['s', 'm', 'l', 'xl'].includes(req.body.size.toLowerCase())) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Size nhập không hợp lệ',
			});
		}
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

		validatedData.discount = validatedData.discount || 5;
		let updatedProduct;
		const sizeRegExp = new RegExp(`^${validatedData.size}$`, 'i');
		const nameRegExp = new RegExp(`^${validatedData.name}$`, 'i');
		const existingProduct = await Product.findOne({
			name: nameRegExp,
			size: sizeRegExp,
		});

		if (existingProduct) {
			if (existingProduct.price !== validatedData.price) {
				return res.status(200).json({
					statusCode: 400,
					statusMessage: 'failed',
					message: 'Sản phẩm đã tồn tại, giá không được thay đổi.Vui lòng thêm lại',
				});
			}

			// Nếu sản phẩm đã tồn tại, cộng dồn quantity
			updatedProduct = await Product.findOneAndUpdate(
				{
					name: validatedData.name,
					size: sizeRegExp,
				},
				{ $inc: { quantity: parseInt(validatedData.quantity) || 0 } },
				{ new: true } // Trả về sản phẩm sau khi cập nhật
			);
		} else {
			// Nếu sản phẩm không tồn tại
			updatedProduct = await Product.create(validatedData);
		}

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: updatedProduct,
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
				message: 'The product ID is required',
			});
		}

		const checkProduct = await Product.findOne({ _id: id });
		if (!checkProduct) {
			return res.status(404).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'Product not found',
			});
		}

		const { name, size, discount } = req.body;

		const sizeRegExp = new RegExp(`^${size}$`, 'i');
		const nameRegExp = new RegExp(`^${name}$`, 'i');
		const existingProduct = await Product.findOne({
			name: nameRegExp,
			size: sizeRegExp,
		});

		if (existingProduct && existingProduct._id.toString() !== id) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Sản phẩm sửa đã tồn tại tên và size trong kho.Vui lòng thay đổi lại.',
			});
		}
		// Thiết lập giá trị mặc định cho discount nếu không được truyền lên
		req.body.discount = discount || 5;

		let result = await Product.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});
		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: result,
		});
	} catch (error) {
		console.error(error);
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
