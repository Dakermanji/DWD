//! config/middleware.js

import { bodyParsers } from '../middlewares/bodyParsers.js';
import { staticFiles } from '../middlewares/staticFiles.js';
import { viewEngine } from '../middlewares/viewEngine.js';

const applyMiddlewares = (app) => {
	bodyParsers(app);
	staticFiles(app);
	viewEngine(app);
};

export default applyMiddlewares;
