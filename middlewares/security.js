//! middlewares/security.js

import helmet from 'helmet';
import compression from 'compression';
import { logMiddlewareErrors } from './helpers.js';

export const secureMiddlewares = (app) => {
	app.use(
		logMiddlewareErrors(
			helmet({
				contentSecurityPolicy: {
					useDefaults: true,
					directives: {
						'default-src': ["'self'"],
						'style-src': [
							"'self'",
							'https://cdn.jsdelivr.net',
							'https://fonts.googleapis.com',
						],
						'script-src': ["'self'", 'https://cdn.jsdelivr.net'],
						'font-src': [
							"'self'",
							'https://fonts.gstatic.com',
							'https://cdn.jsdelivr.net', // <-- added this
						],
						'connect-src': ["'self'"],
						'img-src': ["'self'", 'data:'],
					},
				},
			})
		)
	);

	app.use(logMiddlewareErrors(compression()));
};
