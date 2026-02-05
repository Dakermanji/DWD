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

const applyMiddlewares = (app) => {
	// Core Express middleware
	expressMiddlewares(app);

	// Logging & observability
	loggerMiddlewares(app);
};

export default applyMiddlewares;
