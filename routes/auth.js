//! routes/auth.js

import express from 'express';
import passport from 'passport';
import { postLogin } from '../controllers/auth/login.js';
import { googleCallback, githubCallback } from '../controllers/auth/oauth.js';
import {
	postRegisterEmail,
	getCompleteSignup,
	postCompleteSignup,
} from '../controllers/auth/register.js';
import {
	validateLogin,
	validateRegisterEmail,
	validateCompleteSignup,
} from '../middlewares/validators/auth.js';

const router = express.Router();

// Local
router.post('/login', validateLogin, postLogin);
router.post('/register', validateRegisterEmail, postRegisterEmail);
router.get('/complete-signup/:token', getCompleteSignup);
router.post('/complete-signup', validateCompleteSignup, postCompleteSignup);

// Google
router.get('/google', passport.authenticate('google'));
router.get('/google/callback', googleCallback);

// GitHub
router.get('/github', passport.authenticate('github'));
router.get('/github/callback', githubCallback);

export default router;
