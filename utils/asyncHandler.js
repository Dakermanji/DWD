//! utils/asyncHandler.js

/**
 * asyncHandler
 * ------------
 * Wrap async route handlers / middlewares so any thrown error
 * or rejected promise is forwarded to Express error middleware.
 *
 * Usage:
 * router.get('/path', asyncHandler(async (req, res) => { ... }));
 */

const asyncHandler = (fn) => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};

export default asyncHandler;
