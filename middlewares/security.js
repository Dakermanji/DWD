//! middlewares/security.js

/**
 * Security middleware (Helmet + CSP)
 * ---------------------------------
 * Centralizes HTTP security headers and Content Security Policy (CSP).
 *
 * Goals:
 * - Development: CSP in Report-Only mode to surface violations without breaking the UI.
 * - Production: Enforced CSP to block unexpected/unsafe resource loads.
 *
 * Notes:
 * - We keep CSP directives explicit (predictable) and environment-aware.
 * - "Noisy unless there's a block":
 *   - In dev (report-only), the browser will log violations (expected while building).
 *   - In prod (enforced), violations are blocked; you should only see noise when something is actually blocked.
 */

import helmet from 'helmet';
import env from '../config/dotenv.js';

const securityMiddlewares = (app) => {
	const isProd = env.NODE_ENV === 'production';

	/**
	 * Content Security Policy directives
	 * ----------------------------------
	 * Keep these aligned with what you load in views/layout.ejs:
	 * - Bootstrap / Icons: cdn.jsdelivr.net
	 * - Optional libs (if used): cdnjs.cloudflare.com
	 * - Google Fonts CSS: fonts.googleapis.com
	 * - Google Fonts files: fonts.gstatic.com
	 *
	 * IMPORTANT:
	 * - 'unsafe-inline' is allowed for styles for now (Bootstrap / quick prototyping).
	 *   Later we can tighten with nonces/hashes and remove it.
	 */
	const directives = {
		defaultSrc: ["'self'"],

		// JS: app scripts + approved CDNs
		scriptSrc: [
			"'self'",
			'https://cdn.jsdelivr.net',
			'https://cdnjs.cloudflare.com',
		],

		// CSS: allow Google Fonts CSS and (for now) inline styles
		styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
		styleSrcElem: [
			"'self'",
			'https://cdn.jsdelivr.net',
			'https://cdnjs.cloudflare.com',
			'https://fonts.googleapis.com',
		],
		styleSrcAttr: ["'unsafe-inline'"],

		// Fonts
		fontSrc: [
			"'self'",
			'https://fonts.gstatic.com',
			'https://cdn.jsdelivr.net',
		],

		// Network calls (fetch/XHR/WebSocket). Keep minimal; expand when needed (e.g., APIs, Sentry ingest).
		connectSrc: ["'self'"],

		// Images (self + data URIs). Add domains only when used.
		imgSrc: [
			"'self'",
			'data:',
			'https://openweathermap.org',
			'https://images.unsplash.com',
		],

		// Extra hardening
		objectSrc: ["'none'"],
		frameAncestors: ["'self'"],
		baseUri: ["'self'"],
		formAction: ["'self'"],
	};

	/**
	 * CSP mode
	 * --------
	 * - Dev: Report-Only (helps discover needed sources early without breakage)
	 * - Prod: Enforced (actual protection)
	 *
	 * We keep `useDefaults: false` to avoid surprise directives that can create noisy warnings
	 * or unexpected behavior. The CSP becomes fully deterministic.
	 */
	const contentSecurityPolicy = {
		useDefaults: isProd,
		directives,
		reportOnly: !isProd,
	};

	app.use(
		helmet({
			// CSP (report-only in dev, enforced in prod)
			contentSecurityPolicy,

			// Enable COEP/HSTS only in production
			crossOriginEmbedderPolicy: isProd,
			hsts: isProd,

			/**
			 * - in case deploying behind a proxy/CDN and in need to correct HTTPS detection,
			 *  app.set('trust proxy', 1)
			 */
		})
	);
};

export default securityMiddlewares;
