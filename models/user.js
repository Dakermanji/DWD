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
		 SET username = ?, hashed_password = ?, confirmed = TRUE, token = NULL, token_expiry = NULL
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

// Find user by token (register confirmation or reset password)
export async function findByToken(token) {
	const [rows] = await promisePool.query(
		`SELECT * FROM users WHERE token = ? AND token_expiry > NOW()`,
		[token]
	);
	return rows[0];
}

// Set register/login token and expiry
export async function updateToken(userId, token, expiry) {
	await db.query(
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
	await db.query(
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

export async function createUserWithGitHub(user) {
	//todo
}

export async function createUserWithGoogle(user) {
	//todo
}
