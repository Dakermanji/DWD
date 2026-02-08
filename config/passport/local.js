//! config/passport/local.js

/**
 * Local authentication strategy
 * -----------------------------
 * Authenticates users using:
 * - email + password
 * - OR username + password
 *
 * Notes:
 * - Input validation is handled in the controller.
 * - This strategy focuses only on authentication logic.
 * - Account state checks happen only after credentials are verified,
 *   to avoid leaking account existence or status.
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import * as Sentry from '@sentry/node';
import validator from 'validator';
import userModel from '../../models/user.js';

passport.use(
	new LocalStrategy(
		{
			usernameField: 'identifier',
			passwordField: 'password',
			passReqToCallback: false,
		},
		async (identifier, password, done) => {
			try {
				// Normalize identifier (controller guarantees presence)
				const rawIdentifier = String(identifier).trim();

				// Decide lookup type
				const isEmail = validator.isEmail(rawIdentifier);
				const lookupType = isEmail ? 'email' : 'username';
				const lookupValue = isEmail
					? rawIdentifier.toLowerCase()
					: rawIdentifier;

				// Fetch user with auth fields
				const user = await userModel.findUserBy(
					lookupType,
					lookupValue,
					{ withAuth: true }
				);

				// Generic failure (no enumeration)
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

				// Account state checks (post-auth)
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

				// Success
				return done(null, user);
			} catch (err) {
				Sentry.captureException(err, {
					tags: { area: 'auth', strategy: 'local' },
				});
				return done(err);
			}
		}
	)
);

export default passport;
