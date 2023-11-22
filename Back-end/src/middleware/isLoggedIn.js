import httpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { promisify } from 'util';
const isLoggedIn = async (req, res, next) => {
	if (req.cookies.jwt) {
		const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_ACCESS_SECRET);
		//3. Check if user still exists
		const currentUser = await User.findById(decoded.id);
		if (!currentUser) return next(httpError(401, 'The user belonging to this does no longer exists'));
		//4. Check if user changed password after JWT was issued
		if (currentUser.isPasswordChanged(decoded.iat))
			return next(httpError(401, 'User recently changed password! Please log in again'));
		req.user = currentUser;
		next();
	} else {
		return next(httpError(401, 'You are not logged in! Please log in to get access'));
	}
};

export default isLoggedIn;
