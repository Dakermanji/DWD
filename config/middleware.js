//! config/middleware.js

/**
 * Global middleware loader
 * ------------------------
 * Applies all application-wide middlewares
 * in a single, centralized place.
 *
 * Keeps express.js clean and declarative.
 */

import expressMiddlewares from '../middlewares/express.js';
import loggerMiddlewares from '../middlewares/logger.js';
import securityMiddlewares from '../middlewares/security.js';

const applyMiddlewares = (app) => {
	// Core Express middleware
	expressMiddlewares(app);

	// Security headers
	securityMiddlewares(app);

	// Logging & observability
	loggerMiddlewares(app);
};

export default applyMiddlewares;
