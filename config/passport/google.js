//! config/passport/google.js

/**
 * Google OAuth 2.0 strategy
 * -------------------------
 * Flow:
 * 1) If googleId exists -> login
 * 2) Else if email exists -> link googleId to that user
 * 3) Else -> create new user
 *
 * Note:
 * - If email is missing, we fail gracefully (DB requires email).
 */

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as Sentry from '@sentry/node';
import env from '../dotenv.js';
import userModel from '../../models/user.js';

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
				const email =
					profile.emails?.[0]?.value?.trim().toLowerCase() ?? null;

				// DB requires email
				if (!email) {
					return done(null, false, {
						message: 'auth:error.oauth_email_required',
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

				// 2) Link to existing account by email
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

				// 3) Create new user
				const newUser = await userModel.createOAuthUser({
					email,
					googleId,
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

export default passport;
