//! middlewares/security.js

/**
 * Security middlewares
 * -------------------
 * Applies HTTP security headers using Helmet.
 * Configuration is environment-aware and extendable.
 */

import helmet from 'helmet';
import env from '../config/dotenv.js';

const securityMiddlewares = (app) => {
	app.use(
		helmet({
			// Disable CSP for now (will enable later when EJS + inline scripts exist)
			contentSecurityPolicy: false,

			// Allow cross-origin resources if needed later
			crossOriginEmbedderPolicy: env.NODE_ENV === 'production',
			hsts:
				env.NODE_ENV === 'production'
					? { maxAge: 31536000, includeSubDomains: true }
					: false,
		})
	);
};

export default securityMiddlewares;
