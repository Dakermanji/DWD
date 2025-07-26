//! middlewares/session.js

import session from 'express-session';
import env from '../config/dotenv.js';
import { logMiddlewareErrors } from './helpers.js';

const sessionOptions = {
	secret: env.SESSION_SECRET || 'dakermanji_secret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	},
};

export const sessionMiddleware = (app) => {
	app.use(logMiddlewareErrors(session(sessionOptions)));
};
