//! middlewares/cookies.js

/**
 * Cookie parsing middleware
 * -------------------------
 * Parses incoming cookies and populates `req.cookies`.
 *
 * This is required for:
 * - i18next language detection via cookies
 * - future session handling
 * - CSRF protection
 *
 * Must be registered BEFORE i18n middleware.
 */

import cookieParser from 'cookie-parser';

const cookieMiddlewares = (app) => {
	app.use(cookieParser());
};

export default cookieMiddlewares;
