//! controllers/lang.js

export const changeLanguage = (req, res) => {
	const { locale } = req.params;

	if (!i18n.getLocales().includes(locale)) {
		const err = new Error(`Unsupported locale: '${locale}'`);
		err.status = 400;
		return next(err); // Passes to your global errorHandler
	}

	res.cookie('lang', locale, {
		maxAge: 30 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	}); // 30 days

	const returnTo = req.get('Referer') || '/';
	res.redirect(returnTo);
};
