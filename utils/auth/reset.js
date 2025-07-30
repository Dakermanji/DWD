//! utils/auth/reset.js

import crypto from 'crypto';
import {
	findUserByEmail,
	updateToken,
	incrementTokenRequestCount,
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
