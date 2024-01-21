import joi from 'joi';
import httpError from 'http-errors';
import Product from '../models/Product.js';
import apq from 'api-query-params';

let displayedProductIds = [];

export const getProductTypePagi = async (req, res, next) => {
	try {
		const page = req.query.page;
		const { filter, limit, sort } = apq(req.query);
		delete filter.page;

		const filterData = filter.id ? { _id: filter.id } : filter;
		const offset = limit * (page - 1);

		// Lấy danh sách sản phẩm đã hiển thị
		const displayedProducts = displayedProductIds.slice();

		// Lấy tất cả sản phẩm từ database một lần
		const allProducts = await Product.find(filterData).sort(sort);

		// Lọc bớt các sản phẩm đã xuất hiện trước đó khỏi kết quả mới
		const uniqueProducts = allProducts.filter((product) => {
			const key = `${product.name}_${product.collections_id}`;
			if (!displayedProducts.includes(key)) {
				displayedProducts.push(key); // Thêm sản phẩm vào danh sách đã hiển thị
				return true;
			}
			return false;
		});

		// Phân trang dữ liệu đã lấy được
		const paginatedProducts = uniqueProducts.slice(offset, offset + limit);

		const totalProductCount = displayedProducts.length; // Đếm số sản phẩm đã hiển thị, không đếm trùng

		if (filter.id && uniqueProducts.length === 0) {
			return res.status(404).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'Sản phẩm không được định nghĩa',
			});
		}

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: paginatedProducts,
			totalProduct: totalProductCount,
			totalPage: Math.ceil(totalProductCount / (limit || 10)),
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

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

export const getProductBestSelled = async (req, res, next) => {
	try {
		let page = req.query.page;
		const { filter, limit, sort } = apq(req.query);
		delete filter.page;

		const filterData = filter.id ? { _id: filter.id } : filter;
		const offset = limit * (page - 1);
		const totalProductCount = await Product.countDocuments(filterData);

		// Thêm trường sắp xếp theo selled giảm dần
		const products = await Product.find(filterData)
			.limit(limit)
			.skip(offset)
			.sort({ selled: -1, ...sort });

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
		const product = await Product.find(filterData).limit(limit).skip(offset).sort(sort).select('-image');

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
			colors_id: joi.string(),
			quantity: joi.string(),
			description: joi.string(),
			collections_id: joi.string(),
			discount: joi.number(),
		});

		if (req.body.size && !['S', 'M', 'L', 'XL'].includes(req.body.size.toUpperCase())) {
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
			!validatedData.quantity ||
			!validatedData.colors_id
		) {
			return next(httpError(400, 'Cần điền đẩy đủ thông tin'));
		}

		validatedData.discount = validatedData.discount || 5;
		validatedData.size = validatedData.size ? validatedData.size.toUpperCase() : null;

		let updatedProduct;
		const sizeRegExp = new RegExp(`^${validatedData.size}$`, 'i');
		const nameRegExp = new RegExp(`^${validatedData.name}$`, 'i');
		const existingProduct = await Product.findOne({
			name: nameRegExp,
			size: sizeRegExp,
			collections_id: validatedData.collections_id,
			colors_id: validatedData.colors_id,
		});

		if (existingProduct) {
			if (existingProduct.price !== validatedData.price) {
				return res.status(200).json({
					statusCode: 400,
					statusMessage: 'failed',
					message: 'Sản phẩm đã tồn tại, giá và ảnh không được thay đổi.Vui lòng thêm lại',
				});
			}

			// Nếu sản phẩm đã tồn tại, cộng dồn quantity
			existingProduct.quantity += parseInt(validatedData.quantity) || 0;
			updatedProduct = await existingProduct.save();
		} else {
			// Nếu sản phẩm không tồn tại
			const newProduct = new Product(validatedData);
			updatedProduct = await newProduct.save();
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

		const { name, size, discount, colors_id, collections_id } = req.body;

		const sizeRegExp = new RegExp(`^${size}$`, 'i');
		const nameRegExp = new RegExp(`^${name}$`, 'i');

		const existingProduct = await Product.findOne({
			name: nameRegExp,
			size: sizeRegExp,
			colors_id: colors_id,
			collections_id: collections_id,
		});

		if (existingProduct && existingProduct._id.toString() !== id) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Sản phẩm sửa đã tồn tại tên, size và màu trong kho. Vui lòng thay đổi lại.',
			});
		}

		// Chuyển đổi trường size thành chữ in hoa trước khi cập nhật vào cơ sở dữ liệu
		req.body.size = size ? size.toUpperCase() : null;
		req.body.discount = discount || 5;

		Object.assign(checkProduct, req.body);
		let result = await checkProduct.save();

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
				message: 'The productId is required',
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

export const uploadImagesProduct = async (req, res, next) => {
	try {
		if (!req.file) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Lỗi upload file',
			});
		}

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			path: req.file.path,
			// message: response ? response : 'Không thể upload ảnh',
		});
	} catch (error) {
		console.log(error);
	}
};
