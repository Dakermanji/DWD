//! models/user.js

import { promisePool } from '../config/database.js';

// Create a new user with just email and token (initial register)
export async function createUserWithEmail(email, token, tokenExpiry) {
	const [result] = await promisePool.query(
		`INSERT INTO users (email, token, token_expiry)
		 VALUES (?, ?, ?)`,
		[email, token, tokenExpiry]
	);
	return result.insertId;
}

// Set username and password during register confirmation
export async function setUsernameAndPassword(userId, username, hashedPassword) {
	await promisePool.query(
		`UPDATE users
		 SET username = ?, hashed_password = ?, token = NULL, token_expiry = NULL
		 WHERE id = ?`,
		[username, hashedPassword, userId]
	);
}

// Find user by email (used in local register and login)
export async function findUserByEmail(email) {
	const [rows] = await promisePool.query(
		`SELECT * FROM users WHERE email = ?`,
		[email]
	);
	return rows[0];
}

// Find user by email (used in local register and login)
export async function findUserByUsername(username) {
	const [rows] = await promisePool.query(
		`SELECT * FROM users WHERE username = ?`,
		[username]
	);
	return rows[0];
}

// Find user by token (register confirmation or reset password)
export async function findUserByToken(token) {
	const [rows] = await promisePool.query(
		`SELECT * FROM users WHERE token = ? AND token_expiry > NOW()`,
		[token]
	);
	return rows[0];
}

// Set register/login token and expiry
export async function updateToken(userId, token, expiry) {
	await promisePool.query(
		`UPDATE users SET token = ?, token_expiry = ? WHERE id = ?`,
		[token, expiry, userId]
	);
}

// Find user by ID (used in deserializeUser)
export async function findUserById(id) {
	const [rows] = await promisePool.query(`SELECT * FROM users WHERE id = ?`, [
		id,
	]);
	return rows[0];
}

// Link Google or GitHub ID to existing user (after login)
export async function linkOAuthId(
	userId,
	{ googleId = null, githubId = null }
) {
	const updates = [];
	const params = [];

	if (googleId) {
		updates.push('google_id = ?');
		params.push(googleId);
	}
	if (githubId) {
		updates.push('github_id = ?');
		params.push(githubId);
	}
	params.push(userId);

	const setClause = updates.join(', ');
	await promisePool.query(
		`UPDATE users SET ${setClause} WHERE id = ?`,
		params
	);
}

// Find by OAuth ID
export async function findUserByGoogleId(googleId) {
	const [rows] = await promisePool.query(
		`SELECT * FROM users WHERE google_id = ?`,
		[googleId]
	);
	return rows[0];
}

export async function findUserByGitHubId(githubId) {
	const [rows] = await promisePool.query(
		`SELECT * FROM users WHERE github_id = ?`,
		[githubId]
	);
	return rows[0];
}

// Update last login timestamp
export async function updateLastLogin(userId) {
	await promisePool.query(
		`UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?`,
		[userId]
	);
}

// Check if user is blocked
export async function isBlocked(userId) {
	const [rows] = await promisePool.query(
		`SELECT blocked FROM users WHERE id = ?`,
		[userId]
	);
	return rows[0]?.blocked === 1;
}

// Change block status (admin use)
export async function changeBlockStatus(userId, blocked) {
	await promisePool.query(`UPDATE users SET blocked = ? WHERE id = ?`, [
		blocked ? 1 : 0,
		userId,
	]);
}

// Create new user with Google OAuth
export async function createUserWithGoogle(email, googleId) {
	const [result] = await promisePool.query(
		`INSERT INTO users (email, google_id)
		 VALUES (?, ?)`,
		[email, googleId]
	);
	return findUserById(result.insertId);
}

// Create new user with GitHub OAuth
export async function createUserWithGitHub(email, githubId) {
	const [result] = await promisePool.query(
		`INSERT INTO users (email, github_id)
		 VALUES (?, ?)`,
		[email, githubId]
	);
	return findUserById(result.insertId);
}

export async function incrementTokenRequestCount(userId) {
	await promisePool.query(
		`UPDATE users SET token_request_count = token_request_count + 1 WHERE id = ?`,
		[userId]
	);
}

export async function isUsernameTaken(username) {
	const [rows] = await promisePool.query(
		'SELECT 1 FROM users WHERE username = ? LIMIT 1',
		[username]
	);
	return rows.length > 0;
}

export async function updateUsernameById(id, username) {
	await promisePool.query('UPDATE users SET username = ? WHERE id = ?', [
		username,
		id,
	]);
}
