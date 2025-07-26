//! middlewares/staticFiles.js

import express from 'express';
import { logMiddlewareErrors } from './helpers.js';

export const staticFiles = (app) => {
	app.use(logMiddlewareErrors(express.static('public'))); // Serve static files
};
