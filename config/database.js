//! config/database.js

import mysql from 'mysql2';
import env from './dotenv.js';
import logger from '../utils/logger.js';
import AppError from '../utils/AppError.js';
// config/database.js
import * as Sentry from '@sentry/node'; // add this

// Create connection pool
const pool = mysql.createPool({
	host: env.DB_HOST,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_NAME,
	port: env.DB_PORT,
	connectTimeout: 10000,
	multipleStatements: false,
	debug: false,
});

// Promise wrapper for async/await in model files
const promisePool = pool.promise();

// Internal state tracking
let dbIsReady = false;
const getConnectionStatus = () => dbIsReady;

/**
 * Initialize DB connection check (call once during boot).
 * - Marks dbIsReady true/false
 * - Logs a clear message
 */
async function initDatabase() {
	try {
		await promisePool.query('SELECT 1');
		dbIsReady = true;
		logger.info('✅ Connected to the MySQL database.');
	} catch (err) {
		dbIsReady = false;
		handleDatabaseError(err, { tags: { phase: 'init' } });
	}
}

// Error handling logic
function handleDatabaseError(err, context = {}) {
	const known = {
		PROTOCOL_CONNECTION_LOST: 'Database connection was closed.',
		ER_CON_COUNT_ERROR: 'Database has too many connections.',
		ECONNREFUSED: 'Database connection was refused.',
		ENOTFOUND: 'Database host not found.',
	};

	const message = known[err.code] || `Unexpected DB error: ${err.message}`;

	// Local logs are still useful
	if (env.NODE_ENV === 'development') logger.error(message);
	else logger.warn(message);

	// Sentry: capture once with context
	Sentry.captureException(err, {
		tags: {
			area: 'database',
			code: err.code || 'UNKNOWN',
			...context.tags,
		},
		extra: {
			message,
			host: env.DB_HOST,
			database: env.DB_NAME,
			...context.extra,
		},
	});
}

/**
 * Middleware to block requests when DB is down.
 * Put it globally (early) or only on routes that need DB.
 */
function checkDatabaseMiddleware(req, res, next) {
	if (!getConnectionStatus()) {
		return next(
			new AppError(
				'Database connection failed. Please try again later.',
				500
			)
		);
	}
	return next();
}

// Graceful shutdown
function registerDatabaseShutdownHandlers() {
	process.on('SIGINT', shutdown);
	process.on('SIGTERM', shutdown);

	function shutdown() {
		logger.info('🔌 Closing database pool...');

		pool.end((err) => {
			if (err) {
				handleDatabaseError(err, { tags: { phase: 'shutdown' } });
				process.exit(1);
			}
			logger.info('✅ Database pool closed.');
			process.exit(0);
		});

		setTimeout(() => {
			logger.error('⏱ Forcefully shutting down due to timeout.');
			process.exit(1);
		}, 5000);
	}
}

export default promisePool;
export {
	pool,
	promisePool,
	initDatabase,
	checkDatabaseMiddleware,
	getConnectionStatus,
	registerDatabaseShutdownHandlers,
};
