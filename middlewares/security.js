//! middlewares/security.js

import helmet from 'helmet';
import compression from 'compression';
import { logMiddlewareErrors } from './helpers.js';

export const secureMiddlewares = (app) => {
	app.use(logMiddlewareErrors(helmet()));
	app.use(logMiddlewareErrors(compression()));
};
