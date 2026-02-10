//! middlewares/validators/auth.js

/**
 * Auth validators
 * ---------------
 * Keeps auth controllers small by validating inputs early and consistently.
 *
 * Design goals:
 * - For login: be permissive (accept username OR email + any password string)
 *   and avoid revealing which part was wrong. Only enforce "present + reasonable length".
 * - For register (email-first): validate email only.
 * - For complete signup: enforce username + strong password rules.
 */

import validator from 'validator';
import {
	isValidUsername,
	isValidPassword,
	isSafeEmail,
	normalizeEmail,
	normalizeUsername,
	fail,
} from './common.js';

/**
 * POST /auth/login
 * ----------------
 * Accepts identifier + password.
 * Identifier can be a username OR an email (depending on your login UX).
 *
 * We do NOT apply strong-password rules here because:
 * - Users might have older passwords (or OAuth-only accounts later).
 * - Login should only check that input is present and not obviously garbage.
 * - We always return a generic "invalid_credentials" response anyway.
 */
function validateLogin(req, res, next) {
	const identifier = String(
		req.body.identifier ?? req.body.username ?? ''
	).trim();
	const password = String(req.body.password ?? '');

	// Basic presence checks (keep it generic)
	if (!identifier || !password) {
		return fail(req, res, 'invalid_credentials', 'login');
	}

	// Optional: basic length guard to reduce silly payloads (not "security", just sanity)
	if (identifier.length > 254 || password.length > 1024) {
		return fail(req, res, 'invalid_credentials', 'login');
	}

	// Identifier must be either a valid username format OR a valid email format
	const isEmail = validator.isEmail(identifier);
	const isUsername = isValidUsername(identifier);

	if (!isEmail && !isUsername) {
		return fail(req, res, 'invalid_credentials', 'login');
	}

	// Normalize for downstream usage (optional but nice)
	if (isEmail) req.body.identifier = normalizeEmail(identifier);
	else req.body.identifier = normalizeUsername(identifier);

	next();
}

/**
 * POST /auth/register
 * -------------------
 * Email-first registration step:
 * - accepts email only
 * - always returns a generic response in controller to prevent enumeration
 */
function validateRegisterEmail(req, res, next) {
	const emailRaw = req.body.email;

	// validator.isEmail is already quite good; isSafeEmail is an extra sanity check
	if (!emailRaw) {
		return fail(req, res, 'email_invalid', 'register');
	}

	const email = normalizeEmail(emailRaw);

	if (!validator.isEmail(email) || !isSafeEmail(email)) {
		return fail(req, res, 'email_invalid', 'register');
	}

	// Normalize before controller uses it
	req.body.email = email;

	next();
}

/**
 * POST /auth/complete-signup
 * --------------------------
 * Final step for email-first registration:
 * - username + strong password required
 */
function validateCompleteSignup(req, res, next) {
	const username = req.body.username;
	const password = req.body.password;

	if (!isValidUsername(username)) {
		return fail(req, res, 'username_invalid', 'complete_signup');
	}

	if (!isValidPassword(password)) {
		return fail(req, res, 'password_weak', 'complete_signup');
	}

	// Normalize username before controller uses it
	req.body.username = normalizeUsername(username);

	next();
}

export { validateLogin, validateRegisterEmail, validateCompleteSignup };
