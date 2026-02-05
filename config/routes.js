//! config/routes.js

/**
 * Application routes
 * ------------------
 * Central router that aggregates all route modules.
 * Keeps route registration declarative and organized.
 */

import express from 'express';
import langRoutes from '../routes/lang.js';

// Create router instance
const router = express.Router();

/**
 * Base route
 * Currently used as a simple health / smoke test
 * and to verify i18n wiring.
 */
router.get('/', (req, res) => {
	res.send(req.t('app.name'));
});

/**
 * Language switch routes
 * Example:
 *   /lang/fr?returnTo=/
 *   /lang/ar?returnTo=/projects
 */
router.use('/lang', langRoutes);

export default router;
