import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import sharp from 'sharp';
import httpError from 'http-errors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
const array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

export const uploadSingleFile = async (fileObject, req, res, next) => {
	let minetype = fileObject.mimetype;
	let ext_name = path.extname(fileObject.name);
	let base_name = path.basename(fileObject.name, ext_name);
	let file_name = `${base_name}-${Date.now()}${ext_name}`;
	let uploadPath = path.resolve(__dirname, '../public/images/avatar/' + `${file_name}`);
	let checkPath = path.resolve(__dirname, '../public/images/avatar');
	if (!fs.existsSync(checkPath)) fs.mkdirSync(checkPath, { recursive: true });

	try {
		if (array_of_allowed_files.includes(ext_name) || array_of_allowed_file_types.includes(minetype)) {
			if (req.user && req.user.avatar != '') {
				// Xóa file cũ từ thư mục upload trước khi thực hiện upload file mới
				const oldFilePath = path.resolve(__dirname, '../public/images/avatar/' + req.user.avatar);
				if (fs.existsSync(oldFilePath)) {
					fs.unlinkSync(oldFilePath);
					req.user.avatar = '';
					await req.user.save();
				}
			}
			// Tạo một bản sao của fileObject để upload file
			const fileObjectCopy = { ...fileObject };

			// Resize ảnh và lưu vào file mới mà không cần lưu vào đĩa trước đó
			await sharp(fileObjectCopy.data)
				.resize(500, 600) // Kích thước mới của ảnh
				.toFile(uploadPath); // Lưu ảnh đã resize thành một file mới

			return {
				path: file_name,
				fileName: fileObject.name,
			};
		} else return next(httpError(400, 'Invalid File'));
	} catch (error) {
		console.log(error);
		return next(httpError(error));
	}
};
