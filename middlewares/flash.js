//! middlewares/flash.js

import flash from 'connect-flash';
import { logMiddlewareErrors } from './helpers.js';

export const flashMiddleware = (app) => {
	app.use(logMiddlewareErrors(flash()));

	// Make flash messages available in all views
	app.use((req, res, next) => {
		res.locals.success = req.flash('success');
		res.locals.error = req.flash('error');
		next();
	});
};
