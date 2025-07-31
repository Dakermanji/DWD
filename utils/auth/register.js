//! utils/auth/register.js

import crypto from 'crypto';
import {
	findUserByEmail,
	createUserWithEmail,
	incrementTokenRequestCount,
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

	if (user.hashed_password) return;

	await incrementTokenRequestCount(user.id);

	const currentCount = (user.token_request_count ?? 0) + 1;
	if (currentCount >= 10) {
		return { limited: true };
	}

	if (user.blocked) return { blocked: true };

	const expired =
		!user.token_expiry || new Date(user.token_expiry) < new Date();

	if (expired) {
		await updateToken(user.id, token, tokenExpiry);
		await sendSignupEmail(email, getConfirmUrl(token));
	}

	return { reused: !expired };
}

function getConfirmUrl(token) {
	if (env.NODE_ENV === 'development') {
		return `${env.HOST}:${env.PORT}/auth/register/confirm/${token}`;
	}
	return `${env.HOST}/auth/register/confirm/${token}`;
}
