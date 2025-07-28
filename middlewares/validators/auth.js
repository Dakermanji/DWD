//! middlewares/validators/auth.js

import validator from 'validator';

const usernameRegex = /^[a-zA-Z0-9_.-]{3,20}$/;
const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%^&*()\[\]{}\-_=<>.,:;'"\~`#\\|\/+])[A-Za-z\d!@$%^&*()\[\]{}\-_=<>.,:;'"\~`#\\|\/+]{8,}$/;

export function validateRegisterEmail(req, res, next) {
	const { email } = req.body;

	if (!email || !validator.isEmail(email)) {
		req.flash('error', req.__('auth.invalid_email'));
		req.session.showAuthModal = true;
		req.session.authTab = 'register';
		req.session.registerEmail = email || '';
		return res.redirect('/');
	}

	next();
}

export function validateCompleteAccount(req, res, next) {
	const { username, password, confirmPassword } = req.body;

	if (!username || !usernameRegex.test(username)) {
		req.flash('error', 'auth.invalid_username');
		req.session.showSetUsernameModal = true;
		req.session.authContext = { type: 'local' };
		return res.redirect('/');
	}

	if (!passwordRegex.test(password)) {
		req.flash('error', 'auth.weak_password');
		req.session.showSetUsernameModal = true;
		req.session.authContext = { type: 'local' };
		return res.redirect('/');
	}

	if (password !== confirmPassword) {
		req.flash('error', 'auth.passwords_do_not_match');
		req.session.showSetUsernameModal = true;
		req.session.authContext = { type: 'local' };
		return res.redirect('/');
	}

	req.flash('success', 'auth.registeration_completed');
	next();
}
