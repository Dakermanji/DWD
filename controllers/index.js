//! controllers/index.js

export const renderHomePage = (req, res) => {
	const {
		showAuthModal,
		authTab,
		registerEmail,
		token,
		showSetUsernameModal,
		authContext,
		identifier,
		showResetPasswordModal,
	} = req.session;

	delete req.session.showAuthModal;
	delete req.session.authTab;
	delete req.session.registerEmail;
	delete req.session.token;
	delete req.session.showSetUsernameModal;
	delete req.session.authContext;
	delete req.session.identifier;
	delete req.session.showResetPasswordModal;

	res.render('index', {
		title: 'home.title',
		styles: [
			'index/main',
			'index/hero',
			'index/about',
			'index/services',
			'index/portfolio',
			'index/contact',
			'index/modals',
			'modals',
		],
		scripts: ['index/selectors', 'index/main', 'index/modals'],
		showAuthModal,
		authTab,
		registerEmail,
		token,
		showSetUsernameModal,
		authContext,
		identifier,
		showResetPasswordModal,
	});
};
