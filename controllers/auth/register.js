//! controllers/auth/register.js

/**
 * Email-first registration controller
 * ----------------------------------
 * Step 1: POST /auth/register
 * - Accepts email only
 * - Creates/updates a pending user
 * - Generates a one-time token (store HASH only)
 * - Sends localized email with raw token link
 *
 * Step 2: GET /auth/complete-signup/:token
 * - Stores raw token in session (one-time)
 * - Opens "complete_signup" modal on home
 *
 * Step 3: POST /auth/complete-signup
 * - Reads token from session
 * - Validates token hash + expiry
 * - Sets username + hashed_password
 * - Marks user verified
 * - Clears token fields
 */

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import * as Sentry from '@sentry/node';
import asyncHandler from '../../utils/asyncHandler.js';
import userModel from '../../models/user.js';
import sendSignupEmail from '../../utils/mail/sendSignupEmail.js';

const TOKEN_BYTES = 32; // 256-bit token
const TOKEN_TTL_MINUTES = 60;

const sha256 = (value) =>
	crypto.createHash('sha256').update(value, 'utf8').digest('hex');

export const postRegisterEmail = asyncHandler(async (req, res) => {
	const email = String(req.body.email).trim().toLowerCase();
	const lang = req.session?.lang || 'en';

	// Create or reuse a pending user (queries only)
	const user = await userModel.findUserBy('email', email);

	let userId;
	if (user) {
		userId = user.id;
	} else {
		userId = await userModel.createPendingUser({ email });
	}

	// Ensure token request limit so we do not spam a user
	if (user?.token_request_count >= 5) {
		req.flash('success', 'auth.register.check_email');
		return res.redirect('/');
	}

	// Token generation (store HASH only)
	const rawToken = crypto.randomBytes(TOKEN_BYTES).toString('hex');
	const tokenHash = sha256(rawToken);

	// Resets token + expiry on every request (last email wins)
	const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

	await userModel.setSignupToken({
		userId,
		tokenHash,
		tokenExpiresAt,
	});

	// Send localized email
	try {
		await sendSignupEmail({ to: email, token: rawToken, lang });
	} catch (err) {
		Sentry.captureException(err, {
			tags: { area: 'mail', type: 'signup' },
		});
	}

	// Generic response to prevent email enumeration
	req.flash('success', 'auth.register.check_email');
	req.flash('modal', 'login'); // or 'register' if you prefer
	return res.redirect('/');
});

export const getCompleteSignup = asyncHandler(async (req, res) => {
	const token = String(req.params.token ?? '').trim();

	// Storing token in session so we don't keep it in the URL or rely on query params
	delete req.session.signupToken;
	req.session.signupToken = token;

	// Open the complete signup modal on home
	req.flash('modal', 'complete_signup');
	return res.redirect('/');
});

export const postCompleteSignup = asyncHandler(async (req, res, next) => {
	const token = String(req.session.signupToken ?? '').trim();
	const username = String(req.body.username).trim();
	const password = String(req.body.password);

	// Token must come from session (set by GET /complete-signup/:token)
	if (!token) {
		req.flash('error', 'auth.error.token_invalid');
		req.flash('modal', 'register');
		return res.redirect('/');
	}

	const tokenHash = sha256(token);

	const user = await userModel.findBySignupTokenHash(tokenHash);

	if (!user) {
		delete req.session.signupToken;
		req.flash('error', 'auth.error.token_invalid');
		req.flash('modal', 'register');
		return res.redirect('/');
	}

	// Expired token
	if (
		!user.token_expires_at ||
		new Date(user.token_expires_at) < new Date()
	) {
		delete req.session.signupToken;
		req.flash('error', 'auth.error.token_expired');
		req.flash('modal', 'register');
		return res.redirect('/');
	}

	// Hash password (controller logic)
	const hashedPassword = await bcrypt.hash(password, 12);

	try {
		await userModel.completeSignup({
			userId: user.id,
			username,
			hashedPassword,
		});
	} catch (err) {
		// Handle unique username/email collisions cleanly
		if (err?.code === 'ER_DUP_ENTRY') {
			req.flash('error', 'auth.error.username_taken');
			req.flash('modal', 'complete_signup');
			return res.redirect('/');
		}
		throw err;
	}

	// One-time token: clear session copy
	delete req.session.signupToken;

	// Optionally auto-login after completion:
	req.logIn({ id: user.id }, async (err) => {
		if (err) return next(err);

		req.flash('success', 'auth.register.completed');
		return res.redirect('/');
	});
});
