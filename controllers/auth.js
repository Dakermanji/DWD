//! controllers/auth.js

import passport from '../config/passport.js';
import bcrypt from 'bcrypt';

import { handleRegisterEmail } from '../utils/auth/register.js';
import { resolveLoginUser, authenticateUser } from '../utils/auth/login.js';
import {
	findUserByUsername,
	findUserByToken,
	setUsernameAndPassword,
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
		if (result.limited) {
			req.flash('error', 'auth.too_many_signup_requests');
			return res.redirect('/');
		}

		if (result.blocked) {
			req.flash('error', 'auth.blocked');
			return res.redirect('/');
		}

		res.redirect('/');
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

export function postRequestReset(req, res, next) {
	// TODO: send reset token via email
}

export function getResetForm(req, res, next) {
	// TODO: verify token, show reset modal
}

export function postResetPassword(req, res, next) {
	// TODO: update password for user
}

export function postLogout(req, res, next) {
	req.logout((err) => {
		console.log(err);
		if (err) return next(err);

		req.session.destroy((err) => {
			if (err) return next(err);
			res.clearCookie('connect.sid');
			res.redirect('/');
		});
	});
}

// GOOGLE LOGIN
export const googleLogin = passport.authenticate('google', {
	scope: ['profile', 'email'],
});

export const googleCallback = (req, res, next) => {
	// TODO Google callback
};

// GITHUB LOGIN
export const githubLogin = passport.authenticate('github', {
	scope: ['user:email'],
});

export const githubCallback = (req, res, next) => {
	// TODO GitHub callback
};
