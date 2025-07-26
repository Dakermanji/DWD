//! middlewares/viewEngine.js

import expressLayouts from 'express-ejs-layouts';
import { logMiddlewareErrors } from './helpers.js';

export const viewEngine = (app) => {
	app.use(logMiddlewareErrors(expressLayouts)); // Enable EJS layouts
	app.set('view engine', 'ejs');
	app.set('views', './views');
};
