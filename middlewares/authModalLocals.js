//! middlewares/authModalLocals.js

/**
 * Auth modal locals middleware
 * ----------------------------
 * Transfers one-time modal intent from flash/session
 * into res.locals so views can decide which auth modal
 * to display (e.g. login, reset_password).
 *
 * This approach:
 * - avoids URL query parameters
 * - keeps modal state server-driven
 * - ensures modals open only once per intent
 */

const authModalLocals = (app) => {
	app.use((req, res, next) => {
		// Read modal intent from flash (one-time)
		const modal = req.flash('modal')[0];

		// Expose it to views for the current request only
		if (modal) {
			res.locals.showModal = modal;
		}

		next();
	});
};

export default authModalLocals;
