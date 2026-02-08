//! models/user.js

/**
 * Users model (queries only)
 * --------------------------
 * Keep this file limited to SQL queries. No business logic.
 */

import crypto from 'crypto';
import db from '../config/database.js';

// Fields safe to expose in req.user / views
const PUBLIC_FIELDS = `
	id,
	username,
	email,
	google_id,
	github_id,
	is_blocked,
	is_active,
	is_verified,
	visibility_status,
	last_login_at,
	created_at,
	updated_at
`;

// Sensitive fields (auth only)
const AUTH_FIELDS = `
	hashed_password,
	bad_login_attempts,
	token_hash,
	token_expires_at,
	token_request_count
`;

/**
 * Find a user by a supported key (safe allowlist)
 * @param {'id'|'email'|'username'|'googleId'|'githubId'} by
 * @param {string} value
 * @param {{ withAuth?: boolean }} [options]
 * @returns {Promise<object|null>}
 */
async function findUserBy(by, value, { withAuth = false } = {}) {
	const columnBy = {
		id: 'id',
		email: 'email',
		username: 'username',
		googleId: 'google_id',
		githubId: 'github_id',
	};

	const column = columnBy[by];
	if (!column) {
		throw new Error(`Unsupported lookup key: ${by}`);
	}

	const fields = withAuth
		? `${PUBLIC_FIELDS}, ${AUTH_FIELDS}`
		: PUBLIC_FIELDS;

	const [rows] = await db.query(
		`SELECT ${fields}
		 FROM users
		 WHERE ${column} = ?
		 LIMIT 1`,
		[value]
	);

	return rows[0] ?? null;
}

/**
 * Link OAuth provider IDs to an existing user
 * @param {string} userId
 * @param {Object} providers
 * @param {string} [providers.googleId]
 * @param {string} [providers.githubId]
 */
async function linkOAuthId(userId, { googleId, githubId }) {
	const fields = [];
	const values = [];

	if (googleId) {
		fields.push('google_id = ?');
		values.push(googleId);
	}

	if (githubId) {
		fields.push('github_id = ?');
		values.push(githubId);
	}

	// Nothing to update → no-op
	if (fields.length === 0) return;

	values.push(userId);

	await db.query(
		`UPDATE users
		 SET ${fields.join(', ')}
		 WHERE id = ?
		 LIMIT 1`,
		values
	);
}

async function createOAuthUser({ email, googleId = null, githubId = null }) {
	const id = crypto.randomUUID();

	const columns = [
		'id',
		'email',
		'is_active',
		'is_verified',
		'google_id',
		'github_id',
	];
	const placeholders = ['?', '?', 'TRUE', 'TRUE', '?', '?'];
	const values = [id, email, googleId, githubId];

	await db.query(
		`INSERT INTO users (${columns.join(', ')})
		 VALUES (${placeholders.join(', ')})`,
		values
	);

	return findUserBy('id', id);
}

export default {
	findUserBy,
	createOAuthUser,
	linkOAuthId,
};
