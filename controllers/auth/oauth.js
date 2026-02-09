//! controllers/auth/oauth.js

/**
 * OAuth authentication callbacks
 * -------------------------------
 * Handles OAuth provider callbacks (Google / GitHub).
 *
 * Notes:
 * - OAuth strategies decide success or failure and return i18n-ready messages.
 * - This controller handles UX flow only (flash messages, modals, redirects).
 * - No query parameters are used to control UI state.
 * - Missing provider data (e.g. email) is handled gracefully via flash + modal.
 */

import passport from 'passport';
import asyncHandler from '../../utils/asyncHandler.js';

/**
 * GET /auth/google/callback
 * -------------------------
 * Finalizes Google OAuth authentication.
 */
export const googleCallback = asyncHandler(async (req, res, next) => {
	// Use custom callback to control flash messages and modal behavior
	passport.authenticate('google', (err, user, info) => {
		if (err) return next(err);

		// OAuth authentication failed
		if (!user) {
			// Strategy may provide a specific i18n error key
			if (info?.message) {
				req.flash('error', info.message);
			}

			// Re-open login modal on next request
			req.flash('modal', 'login');

			return res.redirect('/');
		}

		// OAuth authentication succeeded → establish login session
		req.logIn(user, (err) => {
			if (err) return next(err);

			// Redirect after successful OAuth login
			return res.redirect('/');
		});
	})(req, res, next);
});

/**
 * GET /auth/github/callback
 * -------------------------
 * Finalizes GitHub OAuth authentication.
 */
export const githubCallback = asyncHandler(async (req, res, next) => {
	// Same flow as Google; provider-specific logic lives in the strategy
	passport.authenticate('github', (err, user, info) => {
		if (err) return next(err);

		if (!user) {
			if (info?.message) {
				req.flash('error', info.message);
			}

			req.flash('modal', 'login');

			return res.redirect('/');
		}

		req.logIn(user, (err) => {
			if (err) return next(err);

			return res.redirect('/');
		});
	})(req, res, next);
});
