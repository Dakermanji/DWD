//! middlewares/passport.js

import passport from '../config/passport/index.js';

export const initializePassport = (app) => {
	app.use(passport.initialize());
	app.use(passport.session());
};
