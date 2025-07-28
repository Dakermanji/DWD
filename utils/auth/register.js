//! utils/auth/register.js

import crypto from 'crypto';
import {
	findUserByEmail,
	createUserWithEmail,
	incrementTokenRequestCount,
	blockUser,
	updateToken,
} from '../../models/user.js';

export async function handleRegisterEmail(email, req) {
	const token = crypto.randomBytes(32).toString('hex');
	const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

	const user = await findUserByEmail(email);

	if (!user) {
		await createUserWithEmail(email, token, tokenExpiry);
		logSignupURL(token);
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
		logSignupURL(token);
	}

	return { reused: !expired };
}

function logSignupURL(token) {
	const confirmUrl = `${process.env.HOST}/auth/register/confirm/${token}`;
	console.log(`[dev] Signup URL: ${confirmUrl}`);
	// Later: sendSignupEmail(email, confirmUrl)
}
