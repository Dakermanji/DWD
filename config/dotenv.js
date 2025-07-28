//! config/dotenv.js

import dotenv from 'dotenv';
dotenv.config();

// Utility to throw errors for missing required environment variables
function requireEnv(variable) {
	const value = process.env[variable];
	if (value === undefined) {
		throw new Error(
			`[Error]: ${variable} is not defined. Please set it in your environment variables.`
		);
	}
	return value;
}

// Utility to log warnings for missing optional variables
function optionalEnv(variable, defaultValue) {
	if (process.env[variable] === undefined) {
		console.warn(
			`[Warning]: Using default value for ${variable}: ${defaultValue}`
		);
	}
	return process.env[variable] || defaultValue;
}

// Environment configuration
const env = {
	// Required variables
	SESSION_SECRET: requireEnv('SESSION_SECRET'),
	SENTRY_DSN: requireEnv('SENTRY_DSN'),
	SENTRY_PROJECT_ID: requireEnv('SENTRY_PROJECT_ID'),
	DB_USER: requireEnv('DB_USER'),
	DB_PASSWORD: requireEnv('DB_PASSWORD'),
	DB_NAME: requireEnv('DB_NAME'),
	EMAIL_USER: requireEnv('EMAIL_USER'),
	EMAIL_PASS: requireEnv('EMAIL_PASS'),

	// Optional variables with defaults
	PORT: optionalEnv('PORT', 3000),
	HOST: optionalEnv('HOST', 'localhost'),
	NODE_ENV: optionalEnv('NODE_ENV', 'production'),
	DB_HOST: optionalEnv('DB_HOST', 'localhost'),
	DB_PORT: optionalEnv('DB_PORT', 3306),
	EMAIL_SERVICE: optionalEnv('EMAIL_SERVICE', 'gmail'),
};

export default env;
