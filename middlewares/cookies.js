//! middlewares/cookies.js

import cookieParser from 'cookie-parser';

export const cookieParserMiddleware = (app) => {
	app.use(cookieParser());
};
