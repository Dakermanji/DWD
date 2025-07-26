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

	res.status(status).json({
		status,
		error: status === 500 ? 'Internal Server Error' : err.message,
		...(env.NODE_ENV !== 'production' && { stack: err.stack }),
	});
};

export default errorHandler;
