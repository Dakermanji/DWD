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

	let errorKeys = {
		title: 'error_page.title',
		message: 'error_page.generic',
	};

	if (status === 404) {
		errorKeys = {
			title: 'error_page.notFound',
			message: 'error_page.routeMissing',
		};
	}

	res.status(status).render('error', {
		status,
		error_page: errorKeys,
		stack: env.NODE_ENV !== 'production' ? err.stack : null,
	});
};

export default errorHandler;
