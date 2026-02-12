//! controllers/auth/logout.js

import asyncHandler from '../../utils/asyncHandler.js';

/**
 * POST /auth/logout
 * ------------------
 * Logs out the current user and clears the session.
 *
 *
 */
export const postLogout = asyncHandler((req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);

		// Create a fresh session (recommended for security)
		req.session.regenerate((err) => {
			if (err) return next(err);

			req.flash('success', 'auth:logout.successful');
			return res.redirect('/');
		});
	});
});
