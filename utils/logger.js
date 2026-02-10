//! utils/logger.js

/**
 * Application logger (Winston)
 * ----------------------------
 * Single logging interface for the whole app.
 *
 * Goals:
 * - One consistent logger API everywhere (controllers, utils, middlewares).
 * - Dev-friendly output (colors, readable).
 * - Prod-friendly output (timestamps, structured-ish, stack traces).
 * - Works with Morgan via logger.stream.write().
 * - Supports `logger.fatal(...)` as an alias for `logger.error(...)`.
 */

import winston from 'winston';
import util from 'node:util';
import env from '../config/dotenv.js';

const isProd = env.NODE_ENV === 'production';

/**
 * Safely stringify / format messages and meta
 * - Supports logger.info('msg', obj)
 * - Supports logger.error(err) or logger.error('msg', err)
 */
const formatArgs = (...args) => {
	if (args.length === 0) return { message: '' };

	// If first arg is an Error, treat it as the main error
	if (args[0] instanceof Error) {
		return {
			message: args[0].message || 'Error',
			error: args[0],
			meta: args[1],
		};
	}

	// Normal message string/anything
	const message =
		typeof args[0] === 'string'
			? args[0]
			: util.inspect(args[0], { depth: 4 });

	// If second arg is an Error, keep it as error
	const maybe = args[1];
	const error = maybe instanceof Error ? maybe : null;
	const meta = error ? args[2] : maybe;

	return { message, error, meta };
};

const baseFormat = winston.format.combine(
	winston.format.timestamp(),
	winston.format.errors({ stack: true }),
	winston.format.splat()
);

const devFormat = winston.format.combine(
	baseFormat,
	winston.format.colorize({ all: true }),
	winston.format.printf((info) => {
		const ts = info.timestamp;
		const lvl = info.level;
		const msg = info.message;

		// Pull meta from info if present (winston attaches extra fields)
		const { stack, ...rest } = info;
		const metaKeys = Object.keys(rest).filter(
			(k) => !['level', 'message', 'timestamp'].includes(k)
		);

		const meta =
			metaKeys.length > 0
				? `\n${util.inspect(
						metaKeys.reduce(
							(acc, k) => ((acc[k] = rest[k]), acc),
							{}
						),
						{ depth: 4, colors: true }
					)}`
				: '';

		return stack
			? `[${ts}] ${lvl}: ${msg}\n${stack}${meta}`
			: `[${ts}] ${lvl}: ${msg}${meta}`;
	})
);

const prodFormat = winston.format.combine(
	baseFormat,
	winston.format.printf((info) => {
		const ts = info.timestamp;
		const lvl = info.level;
		const msg = info.message;

		const { stack, ...rest } = info;
		const metaKeys = Object.keys(rest).filter(
			(k) => !['level', 'message', 'timestamp'].includes(k)
		);

		const meta =
			metaKeys.length > 0
				? ` ${util.inspect(
						metaKeys.reduce(
							(acc, k) => ((acc[k] = rest[k]), acc),
							{}
						),
						{ depth: 4, colors: false }
					)}`
				: '';

		return stack
			? `[${ts}] ${lvl}: ${msg}\n${stack}${meta}`
			: `[${ts}] ${lvl}: ${msg}${meta}`;
	})
);

const logger = winston.createLogger({
	level: isProd ? 'info' : 'debug',
	format: isProd ? prodFormat : devFormat,
	transports: [
		new winston.transports.Console({
			handleExceptions: false, // we handle process events ourselves
		}),
	],
});

/**
 * Adding `fatal` as a semantic alias (Winston doesn't include it by default).
 * Use it for "log + exit" paths like uncaughtException handlers.
 */
logger.fatal = (...args) => {
	const { message, error, meta } = formatArgs(...args);
	if (error)
		return logger.error(message, { err: error, ...(meta ? { meta } : {}) });
	return logger.error(message, meta ? { meta } : undefined);
};

/**
 * Make morgan compatible:
 * morgan('combined', { stream: logger.stream })
 */
logger.stream = {
	write: (message) => {
		// Morgan includes newline at the end
		logger.http ? logger.http(message.trim()) : logger.info(message.trim());
	},
};

/**
 * Log an Error safely
 */
logger.logError = (err, context) => {
	if (err instanceof Error) {
		logger.error(err.message, {
			stack: err.stack,
			...(context ? { context } : {}),
		});
		return;
	}
	logger.error('Unknown error', { err, ...(context ? { context } : {}) });
};

export default logger;
