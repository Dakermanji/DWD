//! controllers/dashboard.js

export function renderDashboard(req, res, next) {
	try {
		res.render('dashboard', {
			title: 'dashboard.title',
			user: req.user,
		});
	} catch (err) {
		next(err);
	}
}
