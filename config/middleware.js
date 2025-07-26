//! config/middleware.js

import { secureMiddlewares } from '../middlewares/security.js';
import { cookieParserMiddleware } from '../middlewares/cookies.js';
import { sessionMiddleware } from '../middlewares/session.js';
import { flashMiddleware } from '../middlewares/flash.js';
import { bodyParsers } from '../middlewares/bodyParsers.js';
import { staticFiles } from '../middlewares/staticFiles.js';
import { viewEngine } from '../middlewares/viewEngine.js';
import { i18nMiddleware } from '../middlewares/i18n.js';
import { navBarMiddleware } from '../middlewares/navBar.js';
import { customMiddlewares } from '../middlewares/custom.js';

const applyMiddlewares = (app) => {
	secureMiddlewares(app);
	cookieParserMiddleware(app);
	sessionMiddleware(app);
	flashMiddleware(app);
	i18nMiddleware(app);
	navBarMiddleware(app);
	bodyParsers(app);
	staticFiles(app);
	viewEngine(app);
	customMiddlewares(app);
};

export default applyMiddlewares;
