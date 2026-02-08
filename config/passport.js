//! config/passport.js

import passport from 'passport';
import * as Sentry from '@sentry/node';
import userModel from '../models/user.js';

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
		const user = await userModel.findById(id);

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

export default passport;
