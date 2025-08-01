//! controllers/dashboard.js

export function renderDashboard(req, res, next) {
	try {
		res.render('dashboard', {
			title: 'dashboard.title',
			user: req.user,
			scripts: ['dashboard', 'internal_flash'],
			styles: ['dashboard'],
		});
	} catch (err) {
		next(err);
	}
}
