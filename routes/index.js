//! routes/index.js

import express from 'express';
import { renderHomePage } from '../controllers/index.js';

const router = express.Router();

router.get('/', renderHomePage);

export default router;
