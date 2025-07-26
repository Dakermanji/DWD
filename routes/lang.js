//! routes/lang.js

import express from 'express';
import { changeLanguage } from '../controllers/lang.js';

const router = express.Router();

router.get('/:lang', changeLanguage);

export default router;
