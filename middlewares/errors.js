//! middlewares/errors.js

/**
 * Error handling middleware
 * -------------------------
 * - notFound: handles unknown routes
 * - errorHandler: centralized error formatter + logger hook
 */

import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';
import env from '../config/dotenv.js';

const IGNORED_PREFIXES = ['/.well-known/'];

const notFound = (req, res, next) => {
	if (IGNORED_PREFIXES.some((prefix) => req.originalUrl.startsWith(prefix))) {
		return res.sendStatus(404);
	}

	next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || 500;

	// Log unexpected errors (or all errors in development)
	const shouldLog =
		env.NODE_ENV !== 'production' ||
		!err.isOperational ||
		statusCode >= 500;

	if (shouldLog) {
		logger.error(err);
	}

	// JSON response for now (later we can render EJS error pages)
	res.status(statusCode).json({
		status: statusCode,
		message: err.message || 'Internal Server Error',
		...(env.NODE_ENV !== 'production' && { stack: err.stack }),
	});
};

export { notFound, errorHandler };
