//! controllers/index.js

export const renderHomePage = (req, res) => {
	res.render('index', {
		title: 'home.title',
		styles: ['index/main', 'index/hero', 'index/about', 'index/services'],
		scripts: ['index/selectors', 'index/main'],
	});
};
