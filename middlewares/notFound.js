//! middlewares/notFound.js

const ignoredPaths = ['/.well-known/appspecific/com.chrome.devtools.json'];

export const notFoundHandler = (req, res, next) => {
	if (ignoredPaths.includes(req.path)) {
		return res.status(404).end();
	}

	const error = new Error('Page Not Found');
	error.status = 404;

	if (process.env.NODE_ENV === 'development') {
		console.error(`[404 Error]: ${req.originalUrl}`);
	}

	next(error); // Forward error to the global error handler
};
