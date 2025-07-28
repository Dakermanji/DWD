//! controllers/auth.js

import passport from '../config/passport.js';
import { handleRegisterEmail } from '../utils/auth/register.js';

export function postLogin(req, res, next) {
	// TODO: handled by passport-local
}

export async function postRegisterEmail(req, res, next) {
	try {
		const { email } = req.body;

		const result = await handleRegisterEmail(email, req);
		if (result.blocked) {
			req.flash('error', 'auth.too_many_signup_requests');
			return res.redirect('/');
		}

		req.session.showEmailSentModal = true;
		res.redirect('/');
	} catch (err) {
		next(err);
	}
}

export function getConfirmRegister(req, res, next) {
	// TODO: validate token, show setUsernameModal
}

export function postCompleteAccount(req, res, next) {
	// TODO: set username + password, login user
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

export function postLogout(req, res) {
	// TODO: logout
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
