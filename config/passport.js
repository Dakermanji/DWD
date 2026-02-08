//! config/passport.js

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import bcrypt from 'bcrypt';
import * as Sentry from '@sentry/node';
import validator from 'validator';
import userModel from '../models/user.js';
import env from './dotenv.js';

/**
 * Serialize user into session
 * ---------------------------
 * We store ONLY the user ID (UUID).
 */
passport.serializeUser((user, done) => {
	try {
		if (!user?.id) {
			throw new Error('Cannot serialize user without id');
		}
		done(null, user.id);
	} catch (err) {
		Sentry.captureException(err, {
			tags: { area: 'auth', phase: 'serialize' },
		});
		done(err);
	}
});

/**
 * Deserialize user from session
 * -----------------------------
 * Rebuilds req.user from stored user ID.
 */
passport.deserializeUser(async (id, done) => {
	try {
		const user = await userModel.findUserBy('id', id);

		if (!user) {
			// Session exists but user was deleted/disabled
			return done(null, false);
		}

		done(null, user);
	} catch (err) {
		Sentry.captureException(err, {
			tags: { area: 'auth', phase: 'deserialize' },
		});
		done(err);
	}
});

/**
 * Local authentication strategy
 * -----------------------------
 * Allows users to authenticate using:
 * - email + password
 * - OR username + password
 *
 * Notes:
 * - Input validation (empty fields, format) is handled in the controller.
 * - This strategy focuses only on authentication logic.
 * - Account state checks are performed only AFTER credentials are proven,
 *   to avoid leaking account existence or status.
 */
passport.use(
	new LocalStrategy(
		{
			// We accept either email or username in a single field
			usernameField: 'identifier',
			passwordField: 'password',
			passReqToCallback: false,
		},
		async (identifier, password, done) => {
			try {
				// Normalize identifier (controller ensures it exists)
				const rawIdentifier = String(identifier).trim();

				// Decide lookup method based on identifier type
				const by = validator.isEmail(rawIdentifier)
					? 'email'
					: 'username';
				const lookup =
					by === 'email'
						? rawIdentifier.toLowerCase()
						: rawIdentifier;

				// Fetch user with authentication fields
				const user = await userModel.findUserBy(by, lookup, {
					withAuth: true,
				});

				// Fail generically if user does not exist or has no local password
				if (!user || !user.hashed_password) {
					return done(null, false, {
						message: 'auth.error.invalid_credentials',
					});
				}

				// Verify password
				const isValid = await bcrypt.compare(
					password,
					user.hashed_password
				);

				if (!isValid) {
					return done(null, false, {
						message: 'auth.error.invalid_credentials',
					});
				}

				// Account state checks (performed only after credentials are valid)
				if (user.is_blocked) {
					return done(null, false, { message: 'auth.error.blocked' });
				}

				if (!user.is_active) {
					return done(null, false, {
						message: 'auth.error.inactive',
					});
				}

				if (!user.is_verified) {
					return done(null, false, {
						message: 'auth.error.not_verified',
					});
				}

				// Authentication successful
				return done(null, user);
			} catch (err) {
				// Capture unexpected errors for observability
				Sentry.captureException(err, {
					tags: { area: 'auth', strategy: 'local' },
				});
				return done(err);
			}
		}
	)
);

/**
 * Google OAuth 2.0 strategy
 * -------------------------
 * - If google_id exists -> login
 * - Else if email exists -> link google_id to that user
 * - Else -> create a new user
 */

passport.use(
	new GoogleStrategy(
		{
			clientID: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${env.SITE_URL}/auth/google/callback`,
			scope: ['profile', 'email'],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const googleId = String(profile.id);

				// Google usually provides email only if scopes include email
				const email =
					profile.emails?.[0]?.value?.trim().toLowerCase() ?? null;

				// If Google fail to provide an email
				if (!email) {
					return done(null, false, {
						message: 'auth.error.oauth_email_required',
					});
				}

				// 1) Existing Google-linked account
				const existingByGoogle = await userModel.findUserBy(
					'googleId',
					googleId
				);
				if (existingByGoogle) {
					return done(null, existingByGoogle);
				}

				// 2) If email exists, link Google to that account
				if (email) {
					const existingByEmail = await userModel.findUserBy(
						'email',
						email
					);
					if (existingByEmail) {
						await userModel.linkOAuthId(existingByEmail.id, {
							googleId,
						});

						const linkedUser = await userModel.findUserBy(
							'id',
							existingByEmail.id
						);
						return done(null, linkedUser);
					}
				}

				// 3) Create new user
				// - is_verified = true (Google proves email ownership)
				// - is_active = true
				const newUser = await userModel.createOAuthUser({
					googleId,
					email,
				});

				return done(null, newUser);
			} catch (err) {
				Sentry.captureException(err, {
					tags: { area: 'auth', strategy: 'google' },
				});
				return done(err);
			}
		}
	)
);

/**
 * GitHub OAuth strategy
 * -------------------------
 * - If github_id exists -> login
 * - Else if email exists -> link github_id to that user
 * - Else -> create a new user
 */

passport.use(
	new GitHubStrategy(
		{
			clientID: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			callbackURL: `${env.SITE_URL}/auth/github/callback`,
			scope: ['user:email'],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const githubId = String(profile.id);

				// GitHub may provide emails in profile.emails if scope user:email is granted
				const email =
					profile.emails?.[0]?.value?.trim().toLowerCase() ?? null;

				// GitHub may not return an email
				if (!email) {
					return done(null, false, {
						message: 'auth.error.oauth_email_required',
					});
				}

				// 1) Existing GitHub-linked account
				const existingByGithub = await userModel.findUserBy(
					'githubId',
					githubId
				);
				if (existingByGithub) {
					return done(null, existingByGithub);
				}

				// 2) If email exists, link GitHub to that account
				if (email) {
					const existingByEmail = await userModel.findByEmail(email);
					if (existingByEmail) {
						await userModel.linkOAuthId(existingByEmail.id, {
							githubId,
						});

						const linkedUser = await userModel.findById(
							existingByEmail.id
						);
						return done(null, linkedUser);
					}
				}

				// 3) Create new user
				// We generally treat OAuth as verified email, but only if email exists.
				const newUser = await userModel.createOAuthUser({
					githubId,
					email,
				});

				return done(null, newUser);
			} catch (err) {
				Sentry.captureException(err, {
					tags: { area: 'auth', strategy: 'github' },
				});
				return done(err);
			}
		}
	)
);

export default passport;
