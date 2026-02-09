//! routes/auth.js

import express from 'express';
import passport from 'passport';
import { postLogin } from '../controllers/auth/login.js';
import { googleCallback, githubCallback } from '../controllers/auth/oauth.js';

const router = express.Router();

// Local
router.post('/login', postLogin);

// Google
router.get('/google', passport.authenticate('google'));
router.get('/google/callback', googleCallback);

// GitHub
router.get('/github', passport.authenticate('github'));
router.get('/github/callback', githubCallback);

export default router;
