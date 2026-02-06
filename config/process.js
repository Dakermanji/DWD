/**
 * Process lifecycle configuration
 * -------------------------------
 * - Registers global process event handlers
 * - Handles uncaught exceptions and unhandled promise rejections
 * - Ensures graceful shutdown on termination signals (SIGINT, SIGTERM)
 *
 * Notes:
 * - This file centralizes Node.js process-level concerns.
 * - Keeping this logic out of server.js prevents startup pollution.
 * - The HTTP server instance is optional but recommended for clean shutdowns.
 */

import logger from '../utils/logger.js';

/**
 * Initialize Node.js process event handlers
 * @param {import('http').Server} server - HTTP server instance (optional but recommended)
 */
export default function initProcessHandlers(server) {
	/**
	 * Catches synchronous exceptions that were not handled anywhere else.
	 * This usually means the app is in an unsafe state → exit immediately.
	 */
	process.on('uncaughtException', (err) => {
		logger.fatal('Uncaught Exception', err);
		process.exit(1);
	});

	/**
	 * Catches rejected Promises that were not awaited or wrapped.
	 * Attempt a graceful shutdown before exiting.
	 */
	process.on('unhandledRejection', (err) => {
		logger.fatal('Unhandled Rejection', err);

		// Close server first to stop accepting new connections
		if (server) {
			server.close(() => process.exit(1));
		} else {
			process.exit(1);
		}
	});

	/**
	 * SIGTERM is commonly sent by cloud providers (Docker, PM2, Kubernetes).
	 * Should trigger a clean shutdown.
	 */
	process.on('SIGTERM', () => {
		logger.info('SIGTERM received. Shutting down gracefully.');

		if (server) {
			server.close(() => process.exit(0));
		} else {
			process.exit(0);
		}
	});

	/**
	 * SIGINT is triggered when pressing Ctrl+C locally.
	 * Handle it the same way as SIGTERM.
	 */
	process.on('SIGINT', () => {
		logger.info('SIGINT received. Shutting down gracefully.');

		if (server) {
			server.close(() => process.exit(0));
		} else {
			process.exit(0);
		}
	});
}
