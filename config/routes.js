//! config/routes.js

import express from 'express';

import langRoutes from '../routes/lang.js';

const router = express.Router();

router.use('/lang', langRoutes);

export default router;
