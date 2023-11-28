import httpError from 'http-errors';

const restricTo = (...roles) => {
	return (req, res, next) => {
		try {
			if (!roles.includes(req.user.role))
				return next(httpError(403, 'You do not have permission to perform this action'));
			next();
		} catch (error) {
			console.log(error);
			return next(httpError(403, error));
		}
	};
};

export default restricTo;
