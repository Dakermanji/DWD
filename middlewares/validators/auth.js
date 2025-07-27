//! middlewares/validators/auth.js

import validator from 'validator';

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
