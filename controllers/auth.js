//! controllers/auth.js

import passport from '../config/passport.js';
import bcrypt from 'bcrypt';

import { handleRegisterEmail } from '../utils/auth/register.js';
import { resolveLoginUser, authenticateUser } from '../utils/auth/login.js';
import {
	handleResetRequest,
	handlePasswordReset,
} from '../utils/auth/reset.js';
import { respondWithFlashOrJson } from '../utils/respond.js';
import {
	findUserByUsername,
	findUserByToken,
	setUsernameAndPassword,
	isUsernameTaken,
	updateUsernameById,
} from '../models/user.js';

export async function postLogin(req, res, next) {
	const { identifier } = req.body;

	try {
		const user = await resolveLoginUser(identifier);

		if (!user) {
			req.flash('error', 'auth.invalid_credentials');
			req.session.showAuthModal = true;
			req.session.authTab = 'login';
			req.session.identifier = identifier;
			return res.redirect('/');
		}

		authenticateUser(req, res, next, user, identifier);
	} catch (err) {
		next(err);
	}
}

export async function postRegisterEmail(req, res, next) {
	try {
		const { email } = req.body;

		const result = await handleRegisterEmail(email, req);
		if (result?.limited) {
			req.flash('error', 'auth.too_many_signup_requests');
			return res.redirect('/');
		}

		if (result?.blocked) {
			req.flash('error', 'auth.blocked');
			return res.redirect('/');
		}

		// Show success for both new and reused token flows
		req.flash('success', 'auth.signup_email_sent_generic');
		return res.redirect('/');
	} catch (err) {
		next(err);
	}
}

export async function getConfirmRegister(req, res, next) {
	const { token } = req.params;

	try {
		const user = await findUserByToken(token);

		if (
			!user ||
			user.blocked ||
			user.hashed_password ||
			user.token_request_count >= 10
		) {
			req.flash('error', 'auth.invalid_or_expired_token');
			return res.redirect('/');
		}

		// Valid token → show modal to set username/password
		req.session.showSetUsernameModal = true;
		req.session.token = token;
		req.session.authContext = {
			type: 'local',
			email: user.email,
		};

		return res.redirect('/');
	} catch (err) {
		next(err);
	}
}

export async function postCompleteAccount(req, res, next) {
	const { username, password, token } = req.body;

	try {
		const existing = await findUserByUsername(username);
		if (existing) {
			req.flash('error', 'auth.username_taken');
			req.session.showSetUsernameModal = true;
			req.session.authContext = { type: 'local' };
			return res.redirect('/');
		}

		const user = await findUserByToken(token);
		if (
			!user ||
			user.blocked ||
			user.hashed_password ||
			user.token_request_count >= 10
		) {
			req.flash('error', 'auth.invalid_or_expired_token');
			return res.redirect('/');
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		await setUsernameAndPassword(user.id, username, hashedPassword);

		req.login({ id: user.id }, (err) => {
			if (err) return next(err);
			res.redirect('/');
		});
	} catch (err) {
		next(err);
	}
}

export async function postRequestReset(req, res, next) {
	const { email } = req.body;
	const { originalUrl } = req.query;

	try {
		const result = await handleResetRequest(email, req);

		if (result?.denied) {
			req.flash('error', 'auth.blocked_or_limited');
			return res.redirect('/');
		}

		req.flash('success', 'auth.reset_email_sent_generic');

		if (originalUrl) res.redirect(`/${originalUrl}`);
		else res.redirect('/');
	} catch (err) {
		next(err);
	}
}

export async function getResetForm(req, res, next) {
	const { token } = req.params;

	try {
		const user = await findUserByToken(token);

		if (
			!user ||
			user.blocked ||
			!user.token_expiry ||
			new Date(user.token_expiry) < new Date()
		) {
			req.flash('error', 'auth.invalid_or_expired_token');
			return res.redirect('/');
		}

		req.session.showResetPasswordModal = true;
		req.session.token = token;
		req.session.authContext = {
			type: 'reset',
			email: user.email,
		};

		res.redirect('/');
	} catch (err) {
		next(err);
	}
}

export async function postResetPassword(req, res, next) {
	const { password, confirmPassword, token } = req.body;

	try {
		const result = await handlePasswordReset(
			token,
			password,
			confirmPassword
		);

		if (result.error) {
			req.flash('error', result.error);
			return res.redirect('/');
		}

		req.login({ id: result.user.id }, (err) => {
			if (err) return next(err);
			req.flash('success', 'auth.password_changed');
			res.redirect('/');
		});
	} catch (err) {
		next(err);
	}
}

export function postLogout(req, res, next) {
	req.logout((err) => {
		if (err) return next(err);

		req.session.destroy((err) => {
			if (err) return next(err);
			res.clearCookie('connect.sid');
			res.redirect('/');
		});
	});
}

export const googleLogin = passport.authenticate('google', {
	scope: ['profile', 'email'],
});

export function googleCallback(req, res, next) {
	passport.authenticate('google', async (err, user) => {
		if (err) return next(err);

		if (!user) {
			req.flash('error', 'auth.google_oauth_failed');
			return res.redirect('/');
		}

		req.login(user, (err) => {
			if (err) return next(err);

			if (!user.username) {
				req.session.authContext = {
					type: 'oauth',
					email: user.email,
					provider: 'google',
				};
				req.session.showSetUsernameModal = true;
			}

			res.redirect('/');
		});
	})(req, res, next);
}

export const githubLogin = passport.authenticate('github', {
	scope: ['user:email'],
});

export function githubCallback(req, res, next) {
	passport.authenticate('github', async (err, user) => {
		if (err) return next(err);

		if (!user) {
			req.flash('error', 'auth.github_oauth_failed');
			return res.redirect('/');
		}

		req.login(user, (err) => {
			if (err) return next(err);

			if (!user.username) {
				req.session.authContext = {
					type: 'oauth',
					email: user.email,
					provider: 'github',
				};
				req.session.showSetUsernameModal = true;
			}

			res.redirect('/');
		});
	})(req, res, next);
}

export const handleUpdateUsername = async (req, res, next) => {
	try {
		const { username } = req.body;

		if (!username || username === req.user.username) {
			return respondWithFlashOrJson(
				req,
				res,
				400,
				'auth.invalid_username'
			);
		}

		if (await isUsernameTaken(username)) {
			return respondWithFlashOrJson(req, res, 409, 'auth.username_taken');
		}

		await updateUsernameById(req.user.id, username);

		if (req.headers.accept === 'application/json') {
			return res.status(200).json({
				message: req.__('flash.auth.username_updated'),
				key: 'username_updated',
			});
		}

		req.flash('success', 'auth.username_updated');
		res.redirect('/dashboard');
	} catch (err) {
		next(err);
	}
};

export const checkUsernameAvailability = async (req, res, next) => {
	try {
		const { username } = req.query;

		if (
			typeof username !== 'string' ||
			!/^[a-zA-Z0-9_.\-]{3,50}$/.test(username)
		) {
			return res
				.status(400)
				.json({ available: false, reason: 'invalid' });
		}

		const taken = await isUsernameTaken(username);
		res.json({ available: !taken });
	} catch (err) {
		next(err);
	}
};
