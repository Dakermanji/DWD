//! middlewares/bodyParsers.js

import express from 'express';
import { logMiddlewareErrors } from './helpers.js';

export const bodyParsers = (app) => {
	app.use(logMiddlewareErrors(express.urlencoded({ extended: true }))); // Form submissions
	app.use(logMiddlewareErrors(express.json())); // JSON payloads
};
