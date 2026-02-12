//! middlewares/origin.js

import env from '../config/dotenv.js';

/**
 * Origin / Referer guard
 * ----------------------
 * Extra CSRF hardening for state-changing requests.
 *
 * Rules:
 * - For POST/PUT/PATCH/DELETE:
 *   - If Origin header exists → it must match our allowed origin(s)
 *   - Else fall back to Referer → must start with our allowed origin(s)
 *
 * Notes:
 * - Some clients may omit Origin for certain form posts, so Referer fallback matters.
 * - For webhooks (Stripe), this should be skipped at route level.
 */

const METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// Build allowed origins from env (recommended) with safe defaults for dev.
const getAllowedOrigins = () => {
	const list = (env.SITE_URL || env.SITE_URLS || '').trim();

	if (list) {
		return list
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
	}

	// Dev fallback
	return ['http://localhost:3000'];
};

const isAllowed = (value, allowedOrigins) => {
	if (!value) return false;
	return allowedOrigins.some(
		(origin) => value === origin || value.startsWith(origin + '/')
	);
};

const originMiddlewares = (app) => {
	const allowedOrigins = getAllowedOrigins();

	app.use((req, res, next) => {
		if (!METHODS.has(req.method)) return next();

		const origin = req.get('origin');
		const referer = req.get('referer');

		// If Origin exists, enforce it
		if (origin) {
			if (!isAllowed(origin, allowedOrigins)) {
				req.flash('error', 'flash:errors.wrong');
				return res.redirect('/');
			}
			return next();
		}

		// Else enforce Referer if present
		if (referer) {
			if (!isAllowed(referer, allowedOrigins)) {
				req.flash('error', 'flash:errors.wrong');
				return res.redirect('/');
			}
			return next();
		}

		// Neither header present:
		// - dev: don't break local UX
		// - prod: strict block for payment-ready stance
		if (env.NODE_ENV !== 'production') return next();

		req.flash('error', 'flash:errors.wrong');
		return res.redirect('/');
	});
};

export default originMiddlewares;
