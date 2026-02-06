//! middlewares/custom.js

/**
 * Custom middlewares
 * ------------------
 * - Enforces HTTPS in production
 * - Sets common res.locals used by EJS views
 *
 * Notes:
 * - Keep this file small: if it grows, split into focused middlewares.
 */

import env from '../config/dotenv.js';
import { SUPPORTED_LANGUAGES } from '../config/languages.js';

export const customMiddlewares = (app) => {
	// 🔐 Redirect HTTP to HTTPS (production only)
	if (env.NODE_ENV === 'production') {
		// Ensure Express knows it is behind a proxy (Render/Heroku/Nginx/etc.)
		app.set('trust proxy', 1);

		app.use((req, res, next) => {
			// req.secure is reliable when "trust proxy" is set correctly
			if (!req.secure) {
				return res.redirect(
					301,
					`https://${req.get('host')}${req.originalUrl}`
				);
			}
			next();
		});
	}

	// 📌 Set view locals
	app.use((req, res, next) => {
		// Route path without query params (for active states)
		res.locals.currentRoute = req.path;
		// Full URL including query params (for redirects / returnTo)
		res.locals.currentUrl = req.originalUrl;
		// User
		res.locals.user = req.user || null;
		// Supported Languages
		res.locals.supportedLanguages = SUPPORTED_LANGUAGES;
		next();
	});
};
