//! controllers/home.js

/**
 * Home page controller
 * --------------------
 * Renders the main landing page.
 * Adds requestPath so language switching can redirect back to the same page.
 */

const renderHomePage = (req, res) => {
	res.locals.requestPath = req.originalUrl;
	res.render('home', { title: 'home', styles: [], scripts: [] });
};

export default renderHomePage;
