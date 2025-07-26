//! controllers/index.js

export const renderHomePage = (req, res) => {
	res.render('index', {
		title: 'home.title',
	});
};
