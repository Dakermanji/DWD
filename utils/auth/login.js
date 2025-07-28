//! utils/auth/login.js

import passport from '../../config/passport.js';
import validator from 'validator';
import { findUserByEmail, findUserByUsername } from '../../models/user.js';

export async function resolveLoginUser(identifier) {
	const isEmail = validator.isEmail(identifier);
	const lookup = isEmail ? findUserByEmail : findUserByUsername;
	return await lookup(identifier);
}

export function authenticateUser(req, res, next, user, identifier) {
	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);

		if (!user) {
			req.flash('error', 'auth.invalid_credentials');
			req.session.showAuthModal = true;
			req.session.authTab = 'login';
			req.session.identifier = identifier;
			return res.redirect('/');
		}

		req.login(user, (err) => {
			if (err) return next(err);
			res.redirect('/');
		});
	})(req, res, next);
}
