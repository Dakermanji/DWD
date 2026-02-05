//! config/middleware.js

/**
 * Global middleware loader
 * ------------------------
 * Applies all application-wide middlewares
 * in a single, centralized place.
 *
 * This file defines the middleware execution order,
 * which is critical for correctness (cookies → i18n → logging).
 */

import expressMiddlewares from '../middlewares/express.js';
import securityMiddlewares from '../middlewares/security.js';
import cookieMiddlewares from '../middlewares/cookies.js';
import i18nMiddlewares from '../middlewares/i18n.js';
import loggerMiddlewares from '../middlewares/logger.js';

const applyMiddlewares = (app) => {
	/**
	 * Core Express middleware
	 * - static assets
	 * - body parsing
	 */
	expressMiddlewares(app);

	/**
	 * Security headers (Helmet)
	 * Applies to all responses, including static files.
	 */
	securityMiddlewares(app);

	/**
	 * Cookie parsing
	 * Must come BEFORE i18n so language detection can read cookies.
	 */
	cookieMiddlewares(app);

	/**
	 * Internationalization
	 * - resolves language
	 * - attaches req.t
	 * - exposes t(), lang, dir to templates
	 */
	i18nMiddlewares(app);

	/**
	 * Logging & observability
	 * Request logging happens after language resolution
	 * so logs can include language info later if needed.
	 */
	loggerMiddlewares(app);
};

export default applyMiddlewares;
