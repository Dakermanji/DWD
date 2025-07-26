//! middlewares/custom.js

export const customMiddlewares = (app) => {
	// 🔐 Redirect HTTP to HTTPS first
	if (process.env.NODE_ENV === 'production') {
		app.use((req, res, next) => {
			if (req.headers['x-forwarded-proto'] !== 'https') {
				return res.redirect(
					['https://', req.get('Host'), req.url].join('')
				);
			}
			next();
		});
	}

	// 📌 Set current route for view rendering
	app.use((req, res, next) => {
		res.locals.currentRoute = req.path;
		res.locals.user = req.user || null;
		res.locals.authForm = req.session.authForm || null;
		delete req.session.authForm;
		next();
	});
};
