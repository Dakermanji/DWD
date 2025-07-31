//! middlewares/navBar.js

import { navBar } from '../data/navBar.js';
import { logMiddlewareErrors } from './helpers.js';

export const navBarMiddleware = (app) => {
	app.use(
		logMiddlewareErrors((req, res, next) => {
			// Basic default
			let activePage = 'index';

			// example for another navBar options
			if (req.path.startsWith('/dashboard')) activePage = 'dashboard';

			// Attach nav bar data to res.locals
			res.locals.navBar = navBar[activePage] || [];

			next();
		})
	);
};
