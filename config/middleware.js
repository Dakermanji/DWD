//! config/middleware.js

import { secureMiddlewares } from '../middlewares/security.js';
import { cookieParserMiddleware } from '../middlewares/cookies.js';
import { sessionMiddleware } from '../middlewares/session.js';
import { bodyParsers } from '../middlewares/bodyParsers.js';
import { staticFiles } from '../middlewares/staticFiles.js';
import { viewEngine } from '../middlewares/viewEngine.js';
import { i18nMiddleware } from '../middlewares/i18n.js';

const applyMiddlewares = (app) => {
	secureMiddlewares(app);
	cookieParserMiddleware(app);
	sessionMiddleware(app);
	i18nMiddleware(app);
	bodyParsers(app);
	staticFiles(app);
	viewEngine(app);
};

export default applyMiddlewares;
