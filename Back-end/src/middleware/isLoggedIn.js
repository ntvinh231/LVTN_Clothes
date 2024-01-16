import httpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { promisify } from 'util';

const isLoggedIn = async (req, res, next) => {
	try {
		if (req.cookies.jwtR) {
			const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_ACCESS_SECRET);
			//3. Check if user still exists
			const currentUser = await User.findById(decoded.payload).select('+role');

			if (!currentUser) return next(httpError(401, 'The user belonging to this does no longer exists'));

			const decodedR = await promisify(jwt.verify)(req.cookies.jwtR, process.env.JWT_REFRESH_SECRET);

			if (await currentUser.isPasswordChanged(decodedR.iat)) {
				return res.status(200).json({
					statusCode: 401,
					statusMessage: 'success',
					message: 'Gần đây bạn đã đổi mật khẩu vui lòng đăng nhập lại',
				});
			}

			req.user = currentUser;
			next();
		} else {
			return res.status(200).json({
				statusCode: 401,
				statusMessage: 'success',
				message: 'Bạn không đăng nhập vui lòng đăng nhập',
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(200).json({
			statusCode: 401,
			statusMessage: 'failed',
			message: error,
		});
	}
};

export default isLoggedIn;
