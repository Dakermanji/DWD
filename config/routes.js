//! config/routes.js

import express from 'express';

import indexRoutes from '../routes/index.js';
import authRoutes from '../routes/auth.js';
import langRoutes from '../routes/lang.js';
import { notFoundHandler } from '../middlewares/notFound.js';

const router = express.Router();

router.use('/', indexRoutes);
router.use('/auth', authRoutes);
router.use('/lang', langRoutes);
router.use(notFoundHandler);

export default router;
