//! config/passport/index.js

import passport from 'passport';
import * as Sentry from '@sentry/node';
import userModel from '../../models/user.js';

// ------------------------
// Serialize / Deserialize
// ------------------------

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

passport.deserializeUser(async (id, done) => {
	try {
		const user = await userModel.findUserBy('id', id);

		if (!user) {
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

// --------------------
// Strategies
// --------------------

import './local.js';
import './google.js';
import './github.js';

export default passport;
