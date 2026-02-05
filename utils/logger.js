//! utils/logger.js

/**
 * Application logger (Winston)
 * ----------------------------
 * Single logging interface for the whole app.
 * Morgan (HTTP logs) will also pipe into this logger.
 */

import winston from 'winston';
import env from '../config/dotenv.js';

const isProd = env.NODE_ENV === 'production';

const logger = winston.createLogger({
	level: isProd ? 'info' : 'debug',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.printf(({ timestamp, level, message, stack }) => {
			// Include stack traces when available (useful for debugging errors)
			return stack
				? `[${timestamp}] ${level}: ${message}\n${stack}`
				: `[${timestamp}] ${level}: ${message}`;
		})
	),
	transports: [
		// TODO: Console logs for now; later we will add file transports or Sentry
		new winston.transports.Console(),
	],
});

export default logger;
