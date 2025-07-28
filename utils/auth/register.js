//! utils/auth/register.js

import crypto from 'crypto';
import {
	findUserByEmail,
	createUserWithEmail,
	incrementTokenRequestCount,
	blockUser,
	updateToken,
} from '../../models/user.js';
import env from '../../config/dotenv.js';
import { sendSignupEmail } from '../email.js';

export async function handleRegisterEmail(email, req) {
	const token = crypto.randomBytes(32).toString('hex');
	const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

	const user = await findUserByEmail(email);

	if (!user) {
		await createUserWithEmail(email, token, tokenExpiry);
		await sendSignupEmail(email, getConfirmUrl(token));
		return { created: true };
	}

	if (user.confirmed) {
		// Don’t expose registration path to confirmed users
		req.flash('success', 'auth.signup_email_sent_generic');
		return { confirmed: true };
	}

	await incrementTokenRequestCount(user.id);

	const currentCount = (user.token_request_count ?? 0) + 1;
	if (currentCount >= 10) {
		await blockUser(user.id);
		return { blocked: true };
	}

	const expired =
		!user.token_expiry || new Date(user.token_expiry) < new Date();

	if (expired) {
		await updateToken(user.id, token, tokenExpiry);
		await sendSignupEmail(email, getConfirmUrl(token));
	}

	req.flash('success', 'auth.signup_email_sent_generic');
	return { reused: !expired };
}

function getConfirmUrl(token) {
	if (env.NODE_ENV === 'development') {
		return `${env.HOST}:${env.PORT}/auth/register/confirm/${token}`;
	}
	return `${env.HOST}/auth/register/confirm/${token}`;
}
