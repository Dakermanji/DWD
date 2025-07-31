//! middlewares/ensureAuthenticated.js

function restrictRoutesUnlessAuthenticated(req, res, next) {
	const allowedPaths = ['/', '/auth', '/lang'];
	const isAllowed =
		req.path === '/' ||
		allowedPaths.some(
			(prefix) => prefix !== '/' && req.path.startsWith(prefix)
		);

	if (isAllowed || req.isAuthenticated()) {
		return next();
	}

	req.flash('error', 'auth.login_required');
	return res.redirect('/');
}

export const initRestrictRoute = (app) => {
	app.use(restrictRoutesUnlessAuthenticated);
};
