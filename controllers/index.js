//! controllers/index.js

export const renderHomePage = (req, res) => {
	res.render('index', {
		title: 'home.title',
		styles: [
			'index/main',
			'index/hero',
			'index/about',
			'index/services',
			'index/portfolio',
			'index/contact',
		],
		scripts: ['index/selectors', 'index/main'],
	});
};
