//! config/routes.js

/**
 * Application routes
 * ------------------
 * Central router that aggregates all route modules.
 * Keeps route registration declarative and organized.
 */

import express from 'express';
import langRoutes from '../routes/lang.js';
import homeRoutes from '../routes/home.js';

const router = express.Router();

/**
 * Public / base routes
 * Includes the home page and simple smoke-test endpoints.
 */
router.use('/', homeRoutes);

/**
 * Language switching
 * Example:
 *   /lang/fr?returnTo=/
 *   /lang/ar?returnTo=/projects
 */
router.use('/lang', langRoutes);

export default router;
