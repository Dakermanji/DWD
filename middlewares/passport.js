//! middlewares/passport.js

import passport from '../config/passport.js';
import { logMiddlewareErrors } from './helpers.js';

export const initializePassport = (app) => {
	app.use(logMiddlewareErrors(passport.initialize()));
	app.use(logMiddlewareErrors(passport.session()));
};
