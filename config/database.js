//! config/database.js

import mysql from 'mysql2';
import env from './dotenv.js';
import { reportError } from './sentry.js';

// === Create connection pool ===
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

// === Internal state tracking ===
let dbIsReady = false;
const getConnectionStatus = () => dbIsReady;

// === Try to get connection (ping the pool) ===
pool.getConnection((err, connection) => {
	if (err) {
		handleDatabaseError(err);
		dbIsReady = false;
	} else {
		if (env.NODE_ENV === 'development') {
			console.log('✅ Connected to the MySQL database.');
		}
		dbIsReady = true;
		connection.release();
	}
});

// === Error handling logic ===
function handleDatabaseError(err) {
	const known = {
		PROTOCOL_CONNECTION_LOST: 'Database connection was closed.',
		ER_CON_COUNT_ERROR: 'Database has too many connections.',
		ECONNREFUSED: 'Database connection was refused.',
	};

	const message = known[err.code] || `Unexpected DB error: ${err.message}`;
	console[env.NODE_ENV === 'development' ? 'error' : 'warn'](message);
	reportError(new Error(message));
}

// === Middleware to block access when DB is down ===
const checkDatabaseMiddleware = (req, res, next) => {
	if (!getConnectionStatus()) {
		const error = new Error(
			'Database connection failed. Please try again later.'
		);
		error.status = 500;
		return next(error);
	}
	next();
};

// === Graceful shutdown ===
process.on('SIGINT', () => {
	console.log('🔌 Closing database pool...');
	pool.end((err) => {
		if (err) {
			console.error('Error closing the database pool:', err.message);
		} else {
			console.log('✅ Database pool closed.');
		}
		process.exit(0);
	});

	setTimeout(() => {
		console.error('⏱ Forcefully shutting down due to timeout.');
		process.exit(1);
	}, 5000);
});

// === Export promise pool and helpers ===
const promisePool = pool.promise();
export { pool, promisePool, checkDatabaseMiddleware, getConnectionStatus };
