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
 * Find a user by id (UUID)
 * @param {string} id
 * @returns {Promise<object|null>}
 */
async function findById(id) {
	const [rows] = await db.query(
		`SELECT
			${PUBLIC_FIELDS}
		FROM users
		WHERE id = ?
		LIMIT 1`,
		[id]
	);

	return rows[0] ?? null;
}

/**
 * Find a user by email
 * @param {string} email
 * @returns {Promise<object|null>}
 */
async function findByEmail(email, { withAuth = false } = {}) {
	const fields = withAuth
		? `${PUBLIC_FIELDS}, ${AUTH_FIELDS}`
		: PUBLIC_FIELDS;

	const [rows] = await db.query(
		`SELECT ${fields}
		 FROM users
		 WHERE email = ?
		 LIMIT 1`,
		[email]
	);

	return rows[0] ?? null;
}

/**
 * Find a user by username
 * @param {string} username
 * @returns {Promise<object|null>}
 */
async function findByUsername(username, { withAuth = false } = {}) {
	const fields = withAuth
		? `${PUBLIC_FIELDS}, ${AUTH_FIELDS}`
		: PUBLIC_FIELDS;

	const [rows] = await db.query(
		`SELECT ${fields}
		 FROM users
		 WHERE username = ?
		 LIMIT 1`,
		[username]
	);

	return rows[0] ?? null;
}

/**
 * Find a user by Google OAuth id
 * @param {string} googleId
 * @returns {Promise<object|null>}
 */
async function findByGoogleId(googleId) {
	const [rows] = await db.query(
		`SELECT ${PUBLIC_FIELDS}
		 FROM users
		 WHERE google_id = ?
		 LIMIT 1`,
		[googleId]
	);

	return rows[0] ?? null;
}

/**
 * Find a user by GitHub OAuth id
 * @param {string} githubId
 * @returns {Promise<object|null>}
 */
async function findByGithubId(githubId) {
	const [rows] = await db.query(
		`SELECT ${PUBLIC_FIELDS}
		 FROM users
		 WHERE github_id = ?
		 LIMIT 1`,
		[githubId]
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

	return findById(id);
}

export default {
	findById,
	findByEmail,
	findByUsername,
	findByGoogleId,
	findByGithubId,
	createOAuthUser,
	linkOAuthId,
};
