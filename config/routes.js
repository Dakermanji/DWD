//! config/routes.js

import express from 'express';

import langRoutes from '../routes/lang.js';
import { notFoundHandler } from '../middlewares/notFound.js';

const router = express.Router();

router.use('/lang', langRoutes);
router.use(notFoundHandler);

export default router;
