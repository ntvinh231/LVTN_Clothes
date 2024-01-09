import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export const generateAccessTokens = (payload) => {
	const accessToken = jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

	return accessToken;
};

export const generateRefreshToken = (payload) => {
	const refreshToken = jwt.sign({ payload }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: process.env.JWT_REFRESH_IN,
	});

	return refreshToken;
};

export const generateTokens = (payload) => {
	const accessToken = generateAccessTokens(payload);
	const refreshToken = generateRefreshToken(payload);
	return {
		accessToken,
		refreshToken,
	};
};

export const sendToken = (accessToken, code, res, req) => {
	const CookieOptions = {
		secure: false,
		httpOnly: true,
	};
	res.cookie('jwt', accessToken, CookieOptions);
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

		const accessToken = await generateAccessTokens(payload);

		res.cookie('jwt', accessToken, cookieOptions);
		return { status: 'ok', message: 'success', accessToken };
	} catch (error) {
		console.log(error);
		return res.status(200).json({
			status: 'ERR',
			message: 'The authencation',
		});
	}
};
