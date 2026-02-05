//! config/middleware.js

/**
 * Global middleware loader
 * ------------------------
 * Applies all application-wide middlewares
 * in a single, centralized place.
 *
 * Keeps express.js clean and declarative.
 */

import express from 'express';

const applyMiddlewares = (app) => {
	// Serve static assets (CSS, JS, images) from /public
	app.use(express.static('public'));

	// Parse incoming JSON payloads
	app.use(express.json());

	// Parse URL-encoded payloads (forms)
	app.use(express.urlencoded({ extended: true }));
};

export default applyMiddlewares;
