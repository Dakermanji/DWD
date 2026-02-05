//! config/middleware.js

/**
 * Global middleware loader
 * ------------------------
 * Applies all application-wide middlewares in one centralized place.
 *
 * Middleware ORDER matters:
 * - cookies must run before i18n (language detection)
 * - i18n must run before views (template helpers)
 * - logging runs after context is available (lang/dir, user later, etc.)
 */

import expressMiddlewares from '../middlewares/express.js';
import securityMiddlewares from '../middlewares/security.js';
import cookieMiddlewares from '../middlewares/cookies.js';
import i18nMiddlewares from '../middlewares/i18n.js';
import ejsMiddlewares from '../middlewares/ejs.js';
import loggerMiddlewares from '../middlewares/logger.js';

const applyMiddlewares = (app) => {
	/**
	 * Core Express middleware
	 * - static assets
	 * - request body parsing
	 */
	expressMiddlewares(app);

	/**
	 * Security headers (Helmet)
	 * Applies to all responses, including static assets.
	 */
	securityMiddlewares(app);

	/**
	 * Cookie parsing
	 * Required for cookie-based language detection and future sessions.
	 */
	cookieMiddlewares(app);

	/**
	 * Internationalization (i18n)
	 * - resolves language (cookie/header)
	 * - exposes req.t and template locals (t, lang, dir)
	 */
	i18nMiddlewares(app);

	/**
	 * Views (EJS + layouts)
	 * Configures the template engine and layout system.
	 * Must run after i18n so templates can use t/lang/dir.
	 */
	ejsMiddlewares(app);

	/**
	 * Logging & observability
	 * Runs after i18n so logs can include language/context later if needed.
	 */
	loggerMiddlewares(app);
};

export default applyMiddlewares;
