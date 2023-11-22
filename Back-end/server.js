import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './src/routes/userRouter.js';
import productRouter from './src/routes/productRouter.js';
import connection from './src/database/connection.js';
import cookieParser from 'cookie-parser';
import AppError from './src/util/appError.js';
import httpError from 'http-errors';
import fileUpload from 'express-fileupload';
const app = express();
dotenv.config();

const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;
//config file upload
app.use(fileUpload({ createParentPath: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRouter);
app.use('/api', productRouter);
//404 handler and pass to errror handler
app.all('*', (req, res, next) => {
	return next(httpError(404, `Can't find ${req.originalUrl} on this server!`));
});
//error handler
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	let statusMessage;
	if (error.status >= 200 && error.status < 300) {
		statusMessage = 'Success'; // Mã lỗi 2xx thường là thành công
	} else if (error.status >= 300 && error.status < 400) {
		statusMessage = 'Redirection'; // Mã lỗi 3xx thường là chuyển hướng
	} else if (error.status >= 400 && error.status < 500) {
		statusMessage = 'Failed'; // Mã lỗi 4xx thường là lỗi từ phía người dùng
	} else if (error.status >= 500 && error.status < 600) {
		statusMessage = 'Error'; // Mã lỗi 5xx thường là lỗi từ phía máy chủ
	} else {
		statusMessage = 'Unknown'; // Trường hợp không xác định
	}
	return res.json({
		statusCode: error.status,
		statusMessage: statusMessage,
		message: error.message,
	});
});
(async () => {
	try {
		// test connection
		await connection();
		app.listen(port, hostname, () => {
			console.log('ok port', port);
		});
	} catch (error) {
		console.log('>>>Error connec to DB:', error);
	}
})();
