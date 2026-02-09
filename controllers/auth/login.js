//! controllers/auth/login.js

/**
 * POST /auth/login
 * ----------------
 * Handles local authentication using Passport.
 *
 * Notes:
 * - Input validation is handled by validator middleware at the route level.
 * - This controller is responsible for UX flow only (flash messages, modals, redirects).
 * - Authentication logic itself lives in the Passport local strategy.
 */

import passport from 'passport';
import asyncHandler from '../../utils/asyncHandler.js';

export const postLogin = asyncHandler(async (req, res, next) => {
	// Use Passport with a custom callback to fully control:
	// - flash messages
	// - modal behavior
	// - redirect target
	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);

		// Authentication failed
		if (!user) {
			// Strategy provides i18n-ready error key (if any)
			if (info?.message) {
				req.flash('error', info.message);
			}

			// Re-open login modal on the next request (no query params)
			req.flash('modal', 'login');

			return res.redirect('/');
		}

		// Authentication succeeded → establish login session
		req.logIn(user, (err) => {
			if (err) return next(err);

			// Redirect after successful login
			// (can later be changed to dashboard or return-to URL)
			return res.redirect('/');
		});
	})(req, res, next);
});
