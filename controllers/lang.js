//! controllers/lang.js

import i18n from 'i18n';

export const changeLanguage = (req, res, next) => {
	const { lang } = req.params;

	if (!i18n.getLocales().includes(lang)) {
		const err = new Error(`Unsupported locale: '${lang}'`);
		err.status = 400;
		return next(err);
	}

	res.cookie('lang', lang, {
		maxAge: 30 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	});

	const returnTo = req.query.returnTo || '/';
	res.redirect(returnTo);
};
