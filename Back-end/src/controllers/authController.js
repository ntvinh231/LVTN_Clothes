import User from '../models/User.js';
import crypto from 'crypto';
import joi from 'joi';
import { JWTRefreshTokenService, generateTokens, sendToken } from '../middleware/sendToken.js';
import httpError from 'http-errors';
import bcrypt from 'bcrypt';
import { sendMailResetPassword } from '../service/EmailService.js';

export const signUp = async (req, res, next) => {
	try {
		const { name, email, password, confirmPassword, phone, address, avatar, role } = req.body;

		if (!name || !email || !password || !confirmPassword) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Vui lòng điền đầy đủ thông tin.',
			});
		}
		// Kiểm tra email không chứa ký tự đặc biệt ở đầu
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailRegex.test(email)) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Email không hợp lệ.Vui lòng nhập email hợp lệ',
			});
		}
		// Kiểm tra tên không chứa ký tự đặc biệt ở đầu và có từ 3 đến 30 ký tự
		const nameRegex = /^[a-zA-Z0-9]{3,30}$/;
		if (!nameRegex.test(name)) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Tên không hợp lệ. Tên phải có từ 3 đến 30 ký tự.',
			});
		}
		// Kiểm tra xem mật khẩu có khớp nhau không
		if (password !== confirmPassword) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Mật khẩu không khớp.Vui lòng kiểm tra lại',
			});
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Email đã tồn tại.Vui lòng nhập email khác',
			});
		}

		// Trả về một phản hồi thành công nếu dữ liệu hợp lệ
		return res.status(201).json({
			statusCode: 201,
			statusMessage: 'success',
			message: 'Đăng ký thành công.',
		});
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			statusCode: 400,
			statusMessage: 'failed',
			message: 'Đã xảy ra lỗi trong quá trình xử lý.',
		});
	}
};

export const signIn = async (req, res, next) => {
	try {
		const userValidationSchema = joi.object({
			email: joi.string(),
			password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
		});
		const validatedData = await userValidationSchema.validateAsync(req.body);

		if (validatedData.email && !isValidEmail(validatedData.email)) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Email không hợp lệ.Vui lòng nhập email hợp lệ',
			});
		}

		const user = await User.findOne({ email: validatedData.email }).select('+password').select('+role');

		if (!user || !(await bcrypt.compare(validatedData.password, user.password)))
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Sai tài khoản hoặc mật khẩu vui lòng kiểm tra lại',
			});
		req.user = user;
		user.passwordChangedAt = undefined;
		await user.save();
		const response = await generateTokens(user.id);

		const { refreshToken, accessToken } = response;
		res.cookie('jwtR', refreshToken, {
			httpOnly: false,
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

export const updateUserForAdmin = async (req, res, next) => {
	try {
		const data = req.body;
		const existingUser = await User.findOne({ email: req.body.email });
		if (existingUser && existingUser.id !== data.id)
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Email already exists',
			});

		if (!data.name) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Name is required',
			});
		} else if (data.name.length > 25) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Name must not exceed 25 characters',
			});
		}

		const phoneRegex = /^(?:(?:\+|0{0,2})[1-9]\d{0,14}(?:-|\s|)?)?(?:\d{1,5}[-\s]?){0,2}\d{1,5}$/;
		if (data.phone && !phoneRegex.test(data.phone)) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Invalid phone number',
			});
		}
		if (data.email && !isValidEmail(data.email)) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Invalid email address',
			});
		}

		const user = await User.findByIdAndUpdate({ _id: req.params.id }, data, {
			new: true,
			runValidators: true,
		});

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
export const updateUser = async (req, res, next) => {
	try {
		const data = req.body;

		const existingUser = await User.findOne({ email: req.body.email });
		if (existingUser && existingUser.id !== req.user.id)
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Email already exists',
			});
		if (!data.name || !data.phone) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'success',
				message: 'Name, phone are required.',
			});
		} else if (data.name.length > 25) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'success',
				message: 'Name must not exceed 25 characters',
			});
		}

		// Kiểm tra số điện thoại hợp lệ
		const phoneRegex = /^(?:(?:\+|0{0,2})[1-9]\d{0,14}(?:-|\s|)?)?(?:\d{1,5}[-\s]?){0,2}\d{1,5}$/;
		if (data.phone && !phoneRegex.test(data.phone)) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Invalid phone number',
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

export const deleteUser = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'The user is required',
			});
		}
		const checkUser = await User.findOne({
			_id: id,
		});
		if (checkUser == null) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'The user is not defined',
			});
		}
		const result = await User.deleteById({ _id: id });
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

export const deleteManyUser = async (req, res, next) => {
	try {
		const { ids } = req.body;
		if (!ids) {
			return res.status(200).json({
				statusCode: 200,
				statusMessage: 'failed',
				message: 'The product is required',
			});
		}

		let result = await User.delete({ _id: { $in: ids } });

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

export const updatePassword = async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');
	if (!(await user.correctPassword(req.body.oldPass, user.password))) {
		return res.status(200).json({
			statusCode: 401,
			statusMessage: 'failed',
			message: 'Mật khẩu hiện tại của bạn không chính xác',
		});
	}

	if (req.body.newPass !== req.body.newPassConfirm) {
		return res.status(200).json({
			statusCode: 401,
			statusMessage: 'failed',
			message: 'Nhập lại mật khẩu không khớp',
		});
	}
	user.password = req.body.newPassConfirm;
	await user.save();

	return res.status(200).json({
		statusCode: 200,
		statusMessage: 'success',
		Message: 'Đổi mật khẩu thành công',
	});
};

export const forgotPassword = async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (req.body.email && !isValidEmail(req.body.email)) {
		return res.status(200).json({
			statusCode: 400,
			statusMessage: 'failed',
			message: 'Vui lòng nhập email hợp lệ',
		});
	}
	if (!user) {
		return res.status(200).json({
			statusCode: 404,
			statusMessage: 'failed',
			message: 'Địa chỉ email bạn nhập không có. Vui lòng kiểm tra lại.',
		});
	}

	const resetToken = await user.createPasswordResetToken();
	//Disble khi có một trường dùng required
	// await user.save({ validateBeforeSave: false });
	//Khi không có trường nào required
	await user.save();

	const frontendHost = req.body.frontendHost;
	const resetURL = `${frontendHost}/reset-password/${resetToken}`;
	const message1 = `<p style="white-space: nowrap;">Chào <strong>${user.name}</strong> bạn đã gửi một yêu cầu đặt lại mật khẩu</p>`;
	const message2 = `Bạn quên mật khẩu? Nhấn vào đây để tạo lại mật khẩu`;
	const message3 = `\nNếu bạn không phải người gửi yêu cầu, hãy bỏ qua email này`;

	try {
		await sendMailResetPassword({
			email: user.email,
			subject: `Yêu cầu đặt lại mật khẩu của bạn có hiệu lực trong ${process.env.EMAIL_RESET_PASSWORD_EXPIRES} phút`,
			message1,
			message2,
			message3,
			resetURL,
		});

		res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			message: 'Đã gửi thông tin đặt lại mật khẩu của bạn.Vui lòng kiểm tra email',
		});
	} catch (error) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();
		console.log(error);
		return res.status(200).json({
			statusCode: 500,
			statusMessage: 'success',
			Message: 'Có lỗi khi gửi email.Vui lòng thử lại',
		});
	}
};

export const resetPassword = async (req, res, next) => {
	if (req.body.password !== req.body.passwordConfirm) {
		return res.status(200).json({
			statusCode: 400,
			statusMessage: 'failed',
			message: 'Mật khẩu không khớp.Vui lòng kiểm tra lại',
		});
	}
	const hasedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
	const user = await User.findOne({ passwordResetToken: hasedToken, passwordResetExpires: { $gt: Date.now() } });

	if (!user) {
		return res.status(200).json({
			statusCode: 400,
			statusMessage: 'failed',
			message: 'Liên kết đã hết hạn hoặc sai',
		});
	}

	user.password = req.body.password;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	return res.status(200).json({
		statusCode: 200,
		statusMessage: 'success',
		message: 'Đặt lại mật khẩu thành công',
	});
};
