//! middlewares/flash.js

/**
 * Flash messages middleware
 * -------------------------
 * Enables req.flash() and exposes flash messages to templates via res.locals.flash.
 *
 * Notes:
 * - Flash messages are stored in the session and consumed on the NEXT request.
 * - Accessing req.flash('success') / req.flash('error') consumes those messages,
 *   so we centralize it here and use res.locals.flash in EJS.
 */

import flash from 'connect-flash';

const flashMiddlewares = (app) => {
	// Adds req.flash(type, message) and req.flash(type) getters
	app.use(flash());

	// Make flash messages available in views
	app.use((req, res, next) => {
		res.locals.flash = {
			success: req.flash('success'),
			error: req.flash('error'),
		};

		next();
	});
};

export default flashMiddlewares;
