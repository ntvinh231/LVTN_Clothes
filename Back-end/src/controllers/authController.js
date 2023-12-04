import User from '../models/User.js';

import joi from 'joi';
import { JWTRefreshTokenService, generateTokens, sendToken } from '../middleware/sendToken.js';
import httpError from 'http-errors';
import bcrypt from 'bcrypt';
import { uploadSingleFile } from '../service/fileService.js';

export const signUp = async (req, res, next) => {
	try {
		const userValidationSchema = joi.object({
			name: joi.string().min(3).max(30).required(),
			email: joi.string().email(),
			password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
			confirmPassword: joi.string(),
			phone: joi.string(),
			address: joi.string(),
			avatar: joi.string(),
			role: joi.string().default('user'),
			list_favorite: joi.array().items(joi.string()),
		});

		const validatedData = await userValidationSchema.validateAsync(req.body);
		if (!validatedData.name || !validatedData.email || !validatedData.password || !validatedData.confirmPassword) {
			return next(httpError(400, 'The input is required'));
		}
		const existingUser = await User.findOne({ email: validatedData.email });
		if (existingUser) return next(httpError(400, 'Email already exists'));
		if (validatedData.password != validatedData.confirmPassword) {
			return next(httpError(400, 'Passwords do not match '));
		}
		const newUser = await User.create(validatedData);

		const response = await generateTokens(newUser.id);
		sendToken(response, 201, res);
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const signIn = async (req, res, next) => {
	try {
		const userValidationSchema = joi.object({
			email: joi.string().email().required(),
			password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
		});
		const validatedData = await userValidationSchema.validateAsync(req.body);
		const user = await User.findOne({ email: validatedData.email }).select('+password').select('+role');

		if (!user || !(await bcrypt.compare(validatedData.password, user.password)))
			return next(httpError(400, 'Incorrect Email or Password'));

		req.user = user;
		const response = await generateTokens(user.id);

		const { refreshToken, accessToken } = response;
		res.cookie('jwtR', refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'strict',
			path: '/',
		});

		sendToken(accessToken, 201, res, req);
	} catch (error) {
		console.log(error);
	}
};

const isValidEmail = (email) => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
export const updateUser = async (req, res, next) => {
	try {
		const data = req.body;
		if (!data.name || !data.phone || !data.email) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'success',
				message: 'Name, phone, and email are required.',
			});
		}
		if (!data.name) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'success',
				message: 'Name is required',
			});
		} else if (data.name.length > 25) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'success',
				message: 'Name must not exceed 25 characters',
			});
		}

		if (data.email && !isValidEmail(data.email)) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'success',
				message: 'Invalid email address',
			});
		}

		const user = await User.findByIdAndUpdate({ _id: req.user.id }, data, {
			new: true,
			runValidators: true,
		});

		// if (req.files && Object.keys(req.files).length > 0) {
		// 	const imgName = await uploadSingleFile(req.files.avatar, req, res, next);
		// 	user.avatar = imgName.path;
		// 	await user.save();
		// }

		if (!user) {
			return next(httpError(401, 'You are not logged in! Please log in to get access'));
		}

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: {
				validatedData: req.body,
				imgName: user.avatar,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			error: error.message,
			message: 'An internal server error occurred',
		});
	}
};

export const loggout = async (req, res, next) => {
	res.clearCookie('jwt');
	res.clearCookie('jwtR');
	return res.status(200).json({
		status: 200,
		statusMessage: 'success',
		message: 'Logged out successfully',
	});
};

export const getAllUser = async (req, res, next) => {
	try {
		const allUSer = await User.find({}).select('+role');
		return res.status(200).json({
			status: 200,
			statusMessage: 'success',
			data: allUSer,
		});
	} catch (error) {
		return next(httpError(400, 'error'));
	}
};

export const getDetailsUser = async (req, res) => {
	try {
		const userId = req.params.id;

		if (!userId) {
			return next(httpError(400, 'UserId is required'));
		}
		const user = await User.findOne({ _id: userId }).select('+role');
		if (user === null) {
			return next(httpError(404, 'The user is not defined'));
		}
		return res.status(200).json({
			status: 200,
			statusMessage: 'success',
			data: user,
		});
	} catch (error) {}
};

export const refreshToken = async (req, res, next) => {
	try {
		if (!req.cookies.jwtR) {
			return res.status(200).json({
				statusCode: 200,
				statusMessage: 'ERR',
				Message: 'The token is required',
			});
		}
		const response = await JWTRefreshTokenService(req.cookies.jwtR, res, next);
		res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return httpError(404, error);
	}
};
