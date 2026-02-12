//! middlewares/csrf.js

import crypto from 'node:crypto';
import env from '../config/dotenv.js';

/**
 * CSRF middleware (Session-bound + Double Submit Cookie)
 * -----------------------------------------------------
 * Fits the project's middleware pattern: csrfMiddlewares(app)
 *
 * What it does:
 * 1) Issues a CSRF token (once per session)
 *    - stores it in req.session.csrfToken
 *    - sets a cookie `csrf_token` (not httpOnly)
 *    - exposes it to views via res.locals.csrfToken
 *
 * 2) Validates CSRF token on state-changing requests:
 *    - POST / PUT / PATCH / DELETE
 *    - compares the submitted token with:
 *      a) cookie token
 *      b) session token
 *
 * Notes:
 * - Cookie is NOT httpOnly so forms can embed it (server-rendered) and optional client JS can read it.
 * - For webhooks (Stripe), you should skip CSRF on that specific route.
 */

const CSRF_COOKIE = 'csrf_token';
const CSRF_FIELD = '_csrf';
const TOKEN_BYTES = 32;

const NEEDS_CSRF = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const safeEqual = (a, b) => {
	if (typeof a !== 'string' || typeof b !== 'string') return false;
	if (a.length !== b.length) return false;
	return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

const setCsrfCookie = (res, token) => {
	res.cookie(CSRF_COOKIE, token, {
		httpOnly: false,
		secure: env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
	});
};

/**
 * Create/ensure CSRF token exists for this session,
 * and expose it to templates.
 */
const ensureCsrfToken = (req, res, next) => {
	// If sessions aren't enabled for some reason, skip safely.
	if (!req.session) return next();

	if (!req.session.csrfToken) {
		req.session.csrfToken = crypto.randomBytes(TOKEN_BYTES).toString('hex');
	}

	// Always refresh cookie to keep it present (safe + simple)
	setCsrfCookie(res, req.session.csrfToken);

	// Make available to EJS
	res.locals.csrfToken = req.session.csrfToken;

	return next();
};

/**
 * Validate CSRF token for state-changing requests.
 *
 * Sources:
 * - body field: req.body._csrf
 * - header: x-csrf-token (useful later for fetch/AJAX)
 */
const verifyCsrf = (req, res, next) => {
	if (!NEEDS_CSRF.has(req.method)) return next();

	const sessionToken = req.session?.csrfToken;
	const cookieToken = req.cookies?.[CSRF_COOKIE];
	const bodyToken = req.body?.[CSRF_FIELD] || req.get('x-csrf-token') || '';

	// Missing tokens → treat as invalid request
	if (!sessionToken || !cookieToken || !bodyToken) {
		req.flash('error', 'flash:errors.wrong');
		return res.redirect('/');
	}

	// Must match both cookie and session
	if (
		!safeEqual(bodyToken, cookieToken) ||
		!safeEqual(bodyToken, sessionToken)
	) {
		req.flash('error', 'flash:errors.wrong');
		return res.redirect('/');
	}

	return next();
};

const csrfMiddlewares = (app) => {
	// Ensure CSRF token exists and is available to templates
	app.use(ensureCsrfToken);

	// Verify CSRF on state-changing methods
	app.use(verifyCsrf);
};

export default csrfMiddlewares;
