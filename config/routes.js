//! config/routes.js

/**
 * Application routes
 * ------------------
 * Central router that aggregates all route modules.
 */

import express from 'express';

// Create router instance
const router = express.Router();

// Health check / base route
router.get('/', (req, res) => {
	res.send('DWD API is running');
});

export default router;
