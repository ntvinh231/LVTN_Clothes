import jwt from 'jsonwebtoken';
import { promisify } from 'util';

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

	const CookieOptions = {
		secure: false,
		httpOnly: true,
	};
	res.cookie('jwt', accessToken, CookieOptions);
	res.cookie('jwtR', refreshToken, CookieOptions);
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
			secure: false,
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
