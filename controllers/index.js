//! controllers/index.js

export const renderHomePage = (req, res) => {
	const { showAuthModal, authTab, registerEmail } = req.session;

	delete req.session.showAuthModal;
	delete req.session.authTab;
	delete req.session.registerEmail;

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
	});
};
