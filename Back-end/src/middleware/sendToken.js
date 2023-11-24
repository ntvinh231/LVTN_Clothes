import jwt from 'jsonwebtoken';

//create token and send to cookie

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

export const sendToken = (payload, code, res) => {
	const tokens = generateTokens(payload);
	const cookieOptions = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000),
		secure: true,
		httpOnly: true,
	};

	res.cookie('jwt', tokens.accessToken, cookieOptions);
	res.status(code).json({
		status: code,
		statusCode: 'sucess',
		access_token: tokens.accessToken,
		refresh_token: tokens.refreshToken,
	});
};
