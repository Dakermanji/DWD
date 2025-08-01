//! routes/auth.js

import express from 'express';

import { checkProfanity } from '../middlewares/profanity.js';
import {
	postLogin,
	postRegisterEmail,
	getConfirmRegister,
	postCompleteAccount,
	postRequestReset,
	getResetForm,
	postResetPassword,
	postLogout,
	googleLogin,
	googleCallback,
	githubLogin,
	githubCallback,
	handleUpdateUsername,
	checkUsernameAvailability,
} from '../controllers/auth.js';
import {
	validateRegisterEmail,
	validateCompleteAccount,
	validateLoginInput,
	validateResetPassword,
	validateUsernameInput,
} from '../middlewares/validators/auth.js';

const router = express.Router();

// Log In (POST)
router.post('/login', validateLoginInput, postLogin);

// Register (POST: email only)
router.post('/register/email', validateRegisterEmail, postRegisterEmail);

// Confirm Register (GET)
router.get('/register/confirm/:token', getConfirmRegister);

// Complete Account (POST)
router.post(
	'/complete',
	checkProfanity('username'),
	validateCompleteAccount,
	postCompleteAccount
);

// Request Reset (POST)
router.post('/reset/request', postRequestReset);

// Reset Form (GET)
router.get('/reset/:token', getResetForm);

// Reset Password (POST)
router.post('/reset', validateResetPassword, postResetPassword);

// Logout
router.post('/logout', postLogout);

// Google
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

// GitHub
router.get('/github', githubLogin);
router.get('/github/callback', githubCallback);

router.post(
	'/update-username',
	validateUsernameInput,
	checkProfanity('username'),
	handleUpdateUsername
);

router.get('/check-username', checkUsernameAvailability);

export default router;
