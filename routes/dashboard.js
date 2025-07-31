//! routes/dashboard.js

import express from 'express';
import { renderDashboard } from '../controllers/dashboard.js';

const router = express.Router();

router.get('/', renderDashboard);

export default router;
