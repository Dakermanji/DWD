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
} from '../controllers/auth.js';
import {
	validateRegisterEmail,
	validateCompleteAccount,
	validateLoginInput,
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
router.post('/reset', postResetPassword);

// Logout
router.post('/logout', postLogout);

export default router;
