//! controllers/lang.js

/**
 * Change language controller
 * --------------------------
 * - Validates requested language
 * - Stores it in a cookie
 * - Redirects back to a safe internal path
 */

import i18next from '../config/i18n.js';
import AppError from '../utils/AppError.js';

// 30 days
const LANG_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const changeLanguage = (req, res, next) => {
	try {
		const { lang } = req.params;

		// Validate against supported languages (ignore special i18next modes)
		const supported = (
			i18next.options.supportedLngs || ['en', 'fr', 'ar']
		).filter((l) => l && l !== 'cimode');

		if (!supported.includes(lang)) {
			return next(new AppError(`Unsupported locale: '${lang}'`, 400));
		}

		// Store language preference in cookie
		res.cookie('lang', lang, {
			maxAge: LANG_COOKIE_MAX_AGE,
			httpOnly: true,
			sameSite: 'lax',

			// Only mark secure when request is HTTPS (or behind proxy that signals HTTPS)
			secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
		});

		// Prevent open redirects: only allow internal relative paths
		const returnTo =
			typeof req.query.returnTo === 'string' &&
			req.query.returnTo.startsWith('/')
				? req.query.returnTo
				: '/';

		return res.redirect(returnTo);
	} catch (err) {
		return next(err);
	}
};

export default changeLanguage;
