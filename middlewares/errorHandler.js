//! middlewares/errorHandler.js

import env from '../config/dotenv.js';
import { reportError } from '../config/sentry.js';
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
	reportError(err);

	if (env.NODE_ENV !== 'production') {
		console.error('[Error]', err);
	}

	logger.error(`${err.message}`, { stack: err.stack });

	const status = err.status || 500;

	res.render('error', {
		status: 404,
		title: 'error_page.notFound',
		error_page: {
			title: 'error_page.notFound', // this must be a key
			message: 'error_page.routeMissing', // another key
		},
		stack: env.NODE_ENV !== 'production' ? err.stack : null,
	});
};

export default errorHandler;
