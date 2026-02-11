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
import userModel from '../../models/user.js';

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
			if (!user.username) req.flash('modal', 'completeSignup_oauth');
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

/**
 * POST /auth/complete-oauth
 * -------------------------
 * Completes OAuth onboarding by setting a username for the authenticated user.
 */
export const postCompleteOAuth = asyncHandler(async (req, res) => {
	const user = req.user;

	// Shouldn't happen if routes are protected, but to keep it safe.
	if (!user) {
		req.flash('modal', 'register');
		return res.redirect('/');
	}

	const username = String(req.body.username ?? '').trim();

	let affectedRows;
	try {
		affectedRows = await userModel.setUsername({
			userId: user.id,
			username,
		});
	} catch (err) {
		if (err?.code === 'ER_DUP_ENTRY') {
			req.flash('error', 'auth:error.username_taken');
			req.flash('modal', 'completeSignup_oauth');
			return res.redirect('/');
		}
		throw err;
	}

	// Nothing updated → either user doesn't exist OR username already set
	if (affectedRows === 0) {
		req.flash('warning', 'auth:error.username_already_set');
		return res.redirect('/');
	}

	// OAuth user is already authenticated; no need to req.logIn again.
	req.flash('success', 'auth:register.completed');
	return res.redirect('/');
});
