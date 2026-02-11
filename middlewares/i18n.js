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
import { SUPPORTED_LANGUAGES } from '../config/languages.js';

const i18nMiddlewares = (app) => {
	// Attach i18next to the request lifecycle (req.t, req.i18n, req.language)
	app.use(i18nextMiddleware.handle(i18next));

	app.use((req, res, next) => {
		res.locals.t = req.t;

		let lang = req.language || req.i18n?.language || i18next.language;

		// Normalize (en-CA → en)
		lang = lang.slice(0, 2);

		const explicitLang =
			req.query.lang || req.session?.lang || req.cookies?.lang || null;

		const supportedCodes = SUPPORTED_LANGUAGES.map((l) => l.code);

		// If user explicitly chose a language and it's unsupported → warn
		if (explicitLang && !supportedCodes.includes(lang)) {
			req.flash('warning', 'flash:warnings.not_supported_lang');

			// Fallback safely (choose your default)
			lang = 'en';
			req.i18n.changeLanguage(lang);
		}

		res.locals.lang = lang;
		res.locals.dir = lang === 'ar' ? 'rtl' : 'ltr';

		next();
	});
};

export default i18nMiddlewares;
