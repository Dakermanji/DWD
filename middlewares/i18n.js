//! middlewares/i18n.js

/**
 * i18n middleware
 * --------------
 * Registers i18next middleware and exposes helpers to templates:
 * - req.t(key): translate within controllers/routes
 * - res.locals.t(key): translate inside EJS templates later
 * - res.locals.lang: current resolved language (for <html lang="">, direction, etc.)
 */

import i18next from '../config/i18n.js';
import i18nextMiddleware from 'i18next-http-middleware';

const i18nMiddlewares = (app) => {
	// Attach i18next to the request lifecycle (req.t, req.i18n, req.language)
	app.use(i18nextMiddleware.handle(i18next));

	// Make translation helpers available in templates (EJS later)
	app.use((req, res, next) => {
		res.locals.t = req.t;

		// Resolved language (falls back safely if needed)
		res.locals.lang =
			req.language || req.i18n?.language || i18next.language;

		// RTL direction support for Arabic
		res.locals.dir = res.locals.lang === 'ar' ? 'rtl' : 'ltr';

		next();
	});
};

export default i18nMiddlewares;
