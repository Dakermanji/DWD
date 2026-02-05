//! routes/lang.js

/**
 * Language routes
 * ---------------
 * Provides an explicit endpoint to change the UI language
 * by setting a cookie and redirecting back.
 */

import express from 'express';
import changeLanguage from '../controllers/lang.js';

const router = express.Router();

// Example: /lang/fr?returnTo=/
// Example: /lang/ar?returnTo=/projects
router.get('/:lang', changeLanguage);

export default router;
