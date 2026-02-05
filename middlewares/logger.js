//! middlewares/logger.js

import requestLogger from './requestLogger.js';

const loggerMiddlewares = (app) => {
	// Log HTTP requests
	app.use(requestLogger);
};

export default loggerMiddlewares;
