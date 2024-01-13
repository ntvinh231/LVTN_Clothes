import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './src/routes/userRouter.js';
import productRouter from './src/routes/productRouter.js';
import cartRouter from './src/routes/cartRouter.js';
import orderRouter from './src/routes/orderRouter.js';
import connection from './src/database/connection.js';
import cookieParser from 'cookie-parser';
import httpError from 'http-errors';
import fileUpload from 'express-fileupload';
import colorRouter from './src/routes/colorRouter.js';

const app = express();
// Sử dụng cors() một lần với tùy chọn
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true, //access-control-allow-credentials:true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));
app.use(cookieParser());
app.use(express.json());

dotenv.config();

const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

app.get('/', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Max-Age', '1800');
	res.setHeader('Access-Control-Allow-Headers', 'content-type');
	res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH, OPTIONS');
});

//config file upload

app.use('/api/product', productRouter);
app.use('/api/color', colorRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

//404 handler and pass to error handler
app.all('*', (req, res, next) => {
	return next(httpError(404, `Can't find ${req.originalUrl} on this server!`));
});

//error handler
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	let statusMessage;
	if (error.status >= 200 && error.status < 300) {
		statusMessage = 'Success';
	} else if (error.status >= 300 && error.status < 400) {
		statusMessage = 'Redirection';
	} else if (error.status >= 400 && error.status < 500) {
		statusMessage = 'Failed';
	} else if (error.status >= 500 && error.status < 600) {
		statusMessage = 'Error';
	} else {
		statusMessage = 'Unknown';
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
