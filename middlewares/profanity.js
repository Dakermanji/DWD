//! middlewares/profanity.js

import axios from 'axios';

const API_URL = 'https://vector.profanity.dev';
const MIN_WORDS_WORKAROUND = 'test: ';

/**
 * Middleware to check profanity in a specific request field.
 *
 * Usage:
 *   router.post('/route', checkProfanity('username'), handler)
 */
export function checkProfanity(field) {
	return async (req, res, next) => {
		try {
			const value = req.body[field];
			if (!value || typeof value !== 'string') return next();

			const response = await axios.post(API_URL, {
				message: MIN_WORDS_WORKAROUND + value,
			});

			if (response.data?.isProfanity) {
				req.flash('error', 'profanity');

				if (req.originalUrl === '/auth/complete') {
					req.session.token = req.body.token;
					req.session.showSetUsernameModal = true;
					return res.redirect('/');
				} else {
					return res.redirect(req.originalUrl);
				}
			}
		} catch (err) {
			console.error('Profanity check failed:', err.message);
			return next(err);
		}
		next();
	};
}
