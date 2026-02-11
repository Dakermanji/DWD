//! config/dotenv.js

/**
 * Environment configuration loader
 * --------------------------------
 * Loads environment variables and exposes:
 * - a centralized `env` object for application use
 * - helper utilities for validation and testing
 */

import { logger } from '@sentry/node';
import dotenv from 'dotenv';

// Load variables from .env into process.env
dotenv.config();

/**
 * Retrieve a required environment variable.
 * Throws an error if the variable is missing.
 */
function requireEnv(key) {
	const value = process.env[key];

	if (value === undefined) {
		throw new Error(
			`[ENV ERROR] Missing required environment variable: ${key}`
		);
	}

	return value;
}

/**
 * Retrieve an optional environment variable.
 * Falls back to a default value if not provided.
 * Logs a warning in non-production environments.
 */
function optionalEnv(key, defaultValue) {
	const value = process.env[key];

	if (value === undefined && process.env.NODE_ENV !== 'production') {
		logger.warn(
			`[ENV WARNING] ${key} is not set. Using default: ${defaultValue}`
		);
	}

	return value ?? defaultValue;
}

/**
 * Centralized environment configuration
 * ------------------------------------
 * Application code should import this object
 * instead of accessing process.env directly.
 */
const env = {
	// Required variables (enable when needed)
	SESSION_SECRET: requireEnv('SESSION_SECRET'),
	DB_HOST: requireEnv('DB_HOST'),
	DB_USER: requireEnv('DB_USER'),
	DB_PASSWORD: requireEnv('DB_PASSWORD'),
	DB_NAME: requireEnv('DB_NAME'),
	GOOGLE_CLIENT_ID: requireEnv('GOOGLE_CLIENT_ID'),
	GOOGLE_CLIENT_SECRET: requireEnv('GOOGLE_CLIENT_SECRET'),
	GITHUB_CLIENT_ID: requireEnv('GITHUB_CLIENT_ID'),
	GITHUB_CLIENT_SECRET: requireEnv('GITHUB_CLIENT_SECRET'),
	EMAIL_SERVICE: requireEnv('EMAIL_SERVICE'),
	EMAIL_USER: requireEnv('EMAIL_USER'),
	EMAIL_PASS: requireEnv('EMAIL_PASS'),

	// Optional variables with defaults
	SITE_URL: optionalEnv('SITE_URL', 'http://localhost:3000'),
	HOST: optionalEnv('HOST', 'localhost'),
	PORT: Number(optionalEnv('PORT', 3000)),
	NODE_ENV: optionalEnv('NODE_ENV', 'development'),
	SENTRY_DSN: optionalEnv('SENTRY_DSN', ''),
	SENTRY_TRACES_SAMPLE_RATE: Number(
		optionalEnv('SENTRY_TRACES_SAMPLE_RATE', '0.0')
	),
	DB_PORT: optionalEnv('DB_PORT', 3306),
};

export default env;
export { requireEnv, optionalEnv };
