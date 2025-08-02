//! middlewares/social.js

import { logMiddlewareErrors } from './helpers.js';
import { dummySocial } from '../data/social-dummy.js';

export const socialMiddleware = (app) => {
	app.use(
		logMiddlewareErrors((req, res, next) => {
			// Only attach social data if user is logged in
			if (req.user) {
				res.locals.social = dummySocial;
			} else {
				res.locals.social = null;
			}
			next();
		})
	);
};
