import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import httpError from 'http-errors';

export const generateTokens = (payload) => {
	const accessToken = jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
	const refreshToken = jwt.sign({ payload }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: process.env.JWT_REFRESH_IN,
	});

	return {
		accessToken,
		refreshToken,
	};
};

export const sendToken = (response, code, res, req) => {
	const { refreshToken, accessToken } = response;

	const cookieOptions = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000),
		secure: true,
		httpOnly: true,
	};
	res.cookie('jwt', accessToken, cookieOptions);
	res.cookie('jwtR', refreshToken, cookieOptions);
	return res.status(code).json({
		statusCode: code,
		statusMessage: 'sucess',
		Message: 'Login Success',
		accessToken,
	});
};

export const JWTRefreshTokenService = async (token, res, next) => {
	try {
		const cookieOptions = {
			expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000),
			secure: true,
			httpOnly: true,
		};
		const decoded = await promisify(jwt.verify)(token, process.env.JWT_REFRESH_SECRET);

		const { payload } = decoded;

		const tokens = await generateTokens(payload);
		res.cookie('jwt', tokens.accessToken, cookieOptions);

		res.status(200).json({
			status: 'ok',
			message: 'success',
			accessToken: tokens.accessToken,
		});
	} catch (error) {
		console.log(error);
		return res.status(200).json({
			status: 'ERR',
			message: 'The authencation',
		});
	}
};
