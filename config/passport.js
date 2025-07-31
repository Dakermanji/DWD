//! config/passport.js

import validator from 'validator';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import bcrypt from 'bcrypt';

import env from './dotenv.js';
import {
	findUserById,
	findUserByEmail,
	findUserByUsername,
	findUserByGoogleId,
	findUserByGitHubId,
	linkOAuthId,
	createUserWithGoogle,
	createUserWithGitHub,
} from '../models/user.js';

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await findUserById(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});

//*** Local Strategy ***//
passport.use(
	new LocalStrategy(
		{
			usernameField: 'identifier',
			passwordField: 'password',
			passReqToCallback: true,
		},
		async (req, identifier, password, done) => {
			try {
				const isEmail = validator.isEmail(identifier);
				const user = isEmail
					? await findUserByEmail(identifier)
					: await findUserByUsername(identifier);

				if (!user || !user.hashed_password) {
					return done(null, false, {
						message: 'auth.errors.invalid_credentials',
					});
				}

				if (user.blocked) {
					return done(null, false, {
						message: 'auth.errors.blocked',
					});
				}

				const match = await bcrypt.compare(
					password,
					user.hashed_password
				);
				if (!match) {
					return done(null, false, {
						message: 'auth.errors.invalid_credentials',
					});
				}

				return done(null, user);
			} catch (err) {
				return done(err);
			}
		}
	)
);

//*** Google Strategy ***//
passport.use(
	new GoogleStrategy(
		{
			clientID: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			callbackURL: env.GOOGLE_CALLBACK_URL,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const googleId = profile.id;
				const email = profile.emails?.[0]?.value;

				let user = await findUserByGoogleId(googleId);
				if (user) return done(null, user);

				user = await findUserByEmail(email);
				if (user) {
					await linkOAuthId(user.id, { googleId });
					user.google_id = googleId;
					return done(null, user);
				}

				const newUser = await createUserWithGoogle(email, googleId);
				return done(null, newUser);
			} catch (err) {
				return done(err);
			}
		}
	)
);

//*** GitHub Strategy ***//
passport.use(
	new GitHubStrategy(
		{
			clientID: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			callbackURL: env.GITHUB_CALLBACK_URL,
			scope: ['user:email'],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const githubId = profile.id;
				const email =
					profile.emails?.find((e) => e.primary && e.verified)
						?.value || profile.emails?.[0]?.value;

				let user = await findUserByGitHubId(githubId);
				if (user) return done(null, user);

				user = await findUserByEmail(email);
				if (user) {
					await linkOAuthId(user.id, { githubId });
					user.github_id = githubId;
					return done(null, user);
				}

				const newUser = await createUserWithGitHub(email, githubId);
				return done(null, newUser);
			} catch (err) {
				return done(err);
			}
		}
	)
);

export default passport;
