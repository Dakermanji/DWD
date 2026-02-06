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
import initProcessHandlers from './config/process.js';

// Start the Express server and listen for incoming requests
const server = app.listen(env.PORT, () => {
	logger.info(`Server is running on ${env.SITE_URL}`);
});

// Attach process-level handlers (errors, signals, shutdown)
initProcessHandlers(server);
