//! utils/auth/reset.js

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
	findUserByEmail,
	updateToken,
	incrementTokenRequestCount,
	findUserByToken,
	setUsernameAndPassword,
} from '../../models/user.js';
import env from '../../config/dotenv.js';
import { sendResetPasswordEmail } from '../email.js';

export async function handleResetRequest(email, req) {
	const user = await findUserByEmail(email);
	if (!user) return;

	if (user.blocked || user.token_request_count >= 10) {
		return { denied: true };
	}

	const token = crypto.randomBytes(32).toString('hex');
	const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

	await updateToken(user.id, token, tokenExpiry);
	await incrementTokenRequestCount(user.id);

	await sendResetPasswordEmail(user.email, getResetUrl(token));
}

function getResetUrl(token) {
	if (env.NODE_ENV === 'development') {
		return `${env.HOST}:${env.PORT}/auth/reset/${token}`;
	}
	return `${env.HOST}/auth/reset/${token}`;
}

export async function handlePasswordReset(token, password, confirmPassword) {
	if (!token || password !== confirmPassword) {
		return { error: 'auth.invalid_or_expired_token' };
	}

	const user = await findUserByToken(token);

	if (
		!user ||
		user.blocked ||
		!user.token_expiry ||
		new Date(user.token_expiry) < new Date()
	) {
		return { error: 'auth.invalid_or_expired_token' };
	}

	const hashedPassword = await bcrypt.hash(password, 12);
	await setUsernameAndPassword(user.id, null, hashedPassword);

	return { user };
}
