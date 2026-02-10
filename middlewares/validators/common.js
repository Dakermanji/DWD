//! middlewares/validators/common.js

/**
 * Common validation helpers
 * -------------------------
 * Shared validation utilities for auth-related flows.
 *
 * Goals:
 * - Centralize validation rules (single source of truth)
 * - Keep controllers clean
 * - Reuse across local auth, OAuth completion, profile edits
 * - Never throw — always fail gracefully with flash + redirect
 */

/**
 * Username rules:
 * - 3–20 characters
 * - Letters, numbers, underscore, dash, dot
 */
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,20}$/;

/**
 * Password rules:
 * - min 8 chars
 * - at least 1 lowercase
 * - at least 1 uppercase
 * - at least 1 number
 * - at least 1 symbol
 */
const PASSWORD_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%^&*()\[\]{}\-_=<>.,:;'"\~`#\\|\/+])[A-Za-z\d!@$%^&*()\[\]{}\-_=<>.,:;'"\~`#\\|\/+]{8,}$/;

/**
 * Basic email safety check (format only)
 * - Real verification is done by email ownership
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;

/**
 * Normalize helpers
 */
const normalizeEmail = (email) =>
	String(email || '')
		.trim()
		.toLowerCase();

const normalizeUsername = (username) => String(username || '').trim();

/**
 * Validators
 */
const isValidUsername = (username) =>
	USERNAME_REGEX.test(normalizeUsername(username));

const isValidPassword = (password) =>
	PASSWORD_REGEX.test(String(password || ''));

const isSafeEmail = (email) => EMAIL_REGEX.test(normalizeEmail(email));

/**
 * Fail helper
 * -----------
 * Centralized auth validation failure response.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {string} flashKey - suffix for auth.error.*
 * @param {string|false} modal - modal to reopen
 */
const fail = (req, res, flashKey, modal = false) => {
	req.flash('error', `auth.error.${flashKey}`);
	if (modal) req.flash('modal', modal);
	return res.redirect('/');
};

export {
	USERNAME_REGEX,
	PASSWORD_REGEX,
	isValidUsername,
	isValidPassword,
	isSafeEmail,
	normalizeEmail,
	normalizeUsername,
	fail,
};
