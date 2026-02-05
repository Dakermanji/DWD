//! config/requestLogger.js

/**
 * HTTP request logger (Morgan -> Winston)
 * --------------------------------------
 * Logs incoming HTTP requests with method, path, status, and response time.
 * Uses Winston so all logs share the same formatting and transports.
 */

import morgan from 'morgan';
import logger from '../utils/logger.js';

const stream = {
	// write: (message) => logger.http(message.trim()),
	write: (message) => logger.info(message.trim()),
};

const requestLogger = morgan(
	':method :url :status :res[content-length] - :response-time ms',
	{ stream }
);

export default requestLogger;
