//! routes/auth.js

import express from 'express';
import passport from 'passport';
import { postLogin } from '../controllers/auth/login.js';
import {
	googleCallback,
	githubCallback,
	postCompleteOAuth,
} from '../controllers/auth/oauth.js';
import {
	postRegisterEmail,
	getCompleteSignup,
	postCompleteSignup,
} from '../controllers/auth/register.js';
import { postLogout } from '../controllers/auth/logout.js';
import {
	validateLogin,
	validateRegisterEmail,
	validateCompleteSignup,
} from '../middlewares/validators/auth.js';

const router = express.Router();

// Local
router.post('/login', validateLogin, postLogin);
router.post('/register', validateRegisterEmail, postRegisterEmail);

// Google
router.get('/google', passport.authenticate('google'));
router.get('/google/callback', googleCallback);

// GitHub
router.get('/github', passport.authenticate('github'));
router.get('/github/callback', githubCallback);

// Complete Signup
router.get('/complete-signup/:token', getCompleteSignup);
router.post('/complete-signup', validateCompleteSignup, postCompleteSignup);
router.post('/complete-oauth', postCompleteOAuth);

// Logout
router.post('/logout', postLogout);

export default router;
