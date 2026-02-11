//! config/passport/github.js

/**
 * GitHub OAuth strategy
 * ---------------------
 * Flow:
 * 1) If githubId exists -> login
 * 2) Else if email exists -> link githubId to that user
 * 3) Else -> create new user
 *
 * Note:
 * - GitHub may not provide email unless scope "user:email" is granted.
 * - If email is missing, we fail gracefully (DB requires email).
 */

import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import * as Sentry from '@sentry/node';
import env from '../dotenv.js';
import userModel from '../../models/user.js';

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
				const email =
					profile.emails?.[0]?.value?.trim().toLowerCase() ?? null;

				// DB requires email
				if (!email) {
					return done(null, false, {
						message: 'auth:error.oauth_email_required',
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

				// 2) Link to existing account by email
				const existingByEmail = await userModel.findUserBy(
					'email',
					email
				);

				if (existingByEmail) {
					await userModel.linkOAuthId(existingByEmail.id, {
						githubId,
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
					githubId,
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
