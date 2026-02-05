//! utils/AppError.js

/**
 * AppError
 * --------
 * Standard error type for "expected" (operational) errors.
 * Example: invalid input, unauthorized access, not found, etc.
 */

class AppError extends Error {
	constructor(message, statusCode = 500) {
		super(message);

		this.name = 'AppError';
		this.statusCode = statusCode;
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

export default AppError;
