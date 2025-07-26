//! middlewares/helpers.js

export const logMiddlewareErrors = (middleware) => {
	return (req, res, next) => {
		try {
			middleware(req, res, next);
		} catch (err) {
			console.error(`[Middleware Error]: ${err.message}`);
			next(err);
		}
	};
};

// Async wrapper to catch unhandled promise rejections in middleware
export const wrapAsync = (middleware) => {
	return (req, res, next) =>
		Promise.resolve(middleware(req, res, next)).catch(next);
};
