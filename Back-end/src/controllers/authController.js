import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import joi from 'joi';
import { generateTokens, sendToken } from '../middleware/sendToken.js';
import httpError from 'http-errors';
import bcrypt from 'bcrypt';
import { uploadSingleFile } from '../service/fileService.js';

export const signUp = async (req, res, next) => {
	try {
		const userValidationSchema = joi
			.object({
				name: joi.string().min(3).max(30).required(),
				email: joi.string().email(),
				password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
				password_confirm: joi.ref('password'),
				phone: joi.string(),
				address: joi.string(),
				avatar: joi.string(),
				role: joi.string().default('user'),
				list_favorite: joi.array().items(joi.string()),
			})
			.with('password', 'password_confirm');
		const validatedData = await userValidationSchema.validateAsync(req.body);
		const existingUser = await User.findOne({ email: validatedData.email });
		if (existingUser) return next(httpError(409, 'Email already exists'));
		const newUser = await User.create(validatedData);
		sendToken(newUser.id, 201, res);
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
		const user = await User.findOne({ email: validatedData.email }).select('+password');
		if (!user || !(await bcrypt.compare(validatedData.password, user.password)))
			return next(httpError(400, 'Incorrect Email or Password'));
		// console.log(req.user);
		sendToken(user.id, 200, res);
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const updateUser = async (req, res, next) => {
	try {
		const ValidationSchema = joi
			.object({
				name: joi
					.string()
					.max(25)
					.pattern(/^[a-zA-Z0-9\s]*$/)
					.required(),
				newPassword: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
				newPassword_confirm: joi.ref('newPassword'),
				address: joi.string(),
				phone: joi.string(),
				avatar: joi.string(),
			})
			.with('newPassword', 'newPassword_confirm');

		const validatedData = await ValidationSchema.validateAsync(req.body);
		const user = await User.findByIdAndUpdate({ _id: req.user.id }, validatedData, {
			new: true, // trả về dữ liệu mới sau khi cập nhật thay vì dữ liệu cũ
			runValidators: true, // bảo rằng dữ liệu mới cập nhật đáp ứng ràng buộc trong model .
		});
		let imgName;
		if (!req.files || Object.keys(req.files).length == 0) {
			//do nothing
		} else {
			imgName = await uploadSingleFile(req.files.avatar, req, res, next);
			user.avatar = imgName.path;
			await user.save();
		}
		if (validatedData.newPassword) {
			user.password = validatedData.newPassword;
			user.passwordConfirm = validatedData.newPassword_confirm;
			validatedData.newPassword = undefined;
			validatedData.newPassword_confirm = undefined;
			await user.save();
		}
		if (!user) return next(httpError(401, 'You are not logged in! Please log in to get access'));

		let data = {
			validatedData,
			imgName,
		};
		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data,
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};
