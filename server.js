//! server.js

/**
 * Application entry point
 * -----------------------
 * This file is responsible for starting the HTTP server.
 * It imports the configured Express app and binds it
 * to a network port.
 */

import app from './config/express.js';
import env from './config/dotenv.js';
import logger from './utils/logger.js';

// Start the Express server and listen for incoming requests
const server = app.listen(env.PORT, () => {
	logger.info(`Server is running on ${env.SITE_URL}`);
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason, promise) => {
	const err = reason instanceof Error ? reason : new Error(String(reason));
	logger.error('Unhandled Promise Rejection', err);

	// Gracefully shut down the server
	server.close(() => {
		process.exit(1);
	});
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error) => {
	logger.error('Uncaught Exception', error);

	// Exit immediately — app state is unsafe
	process.exit(1);
});
