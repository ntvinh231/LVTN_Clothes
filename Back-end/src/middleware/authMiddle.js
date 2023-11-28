import httpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { promisify } from 'util';

const authMiddle = async (req, res, next) => {
	if (req.cookies.jwt) {
		try {
			const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_ACCESS_SECRET);

			const currentUser = await User.findById(decoded.payload).select('+role');
			// if (currentUser.role == 'admin' }} currentUser.id == ) {
			// 	;
			// 	next();
			// }

			next();
		} catch (error) {
			return next(httpError(404, 'The authencation'));
		}
	} else {
		return next(httpError(401, 'You are not logged in! Please log in to get access1'));
	}
};

export default authMiddle;
