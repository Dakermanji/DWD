//! middlewares/session.js

/**
 * Session middleware
 * ------------------
 * Required for:
 * - flash messages
 * - future authentication (Passport)
 *
 * Note:
 * - Default MemoryStore is fine for development but not recommended for production.
 *   We'll replace it later with a persistent store (e.g., MySQL/Redis).
 *
 * SESSION_SECRET is validated during application bootstrap
 * via config/dotenv.js.
 */

import session from 'express-session';
import env from '../config/dotenv.js';

const sessionMiddlewares = (app) => {
	app.use(
		session({
			name: 'dwd.sid',
			secret: env.SESSION_SECRET,

			resave: false,
			saveUninitialized: false,

			cookie: {
				httpOnly: true,
				sameSite: 'lax',
				secure: env.NODE_ENV === 'production',
				maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
			},
		})
	);
};

export default sessionMiddlewares;
