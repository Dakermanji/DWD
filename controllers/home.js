//! controllers/home.js

/**
 * Home page controller
 * --------------------
 * Renders the main landing page.
 * Adds requestPath so language switching can redirect back to the same page.
 */

const renderHomePage = (req, res) => {
	res.locals.requestPath = req.originalUrl;
	res.render('home/main', {
		titleKey: 'nav:home',
		styles: [
			'home/main',
			'home/hero',
			'home/about',
			'home/services',
			'home/portfolio',
		],
		scripts: [
			'home/selectors',
			'home/background',
			'home/about',
			'home/portfolio',
		],
	});
};

export default renderHomePage;
