//! instrument.js

/**
 * Sentry instrumentation (must load before anything else)
 * ------------------------------------------------------
 * This file is imported BEFORE the app starts so Sentry can
 * auto-instrument modules (Express, DB libs, etc).
 */

import * as Sentry from '@sentry/node';
import env from './config/dotenv.js';

Sentry.init({
	dsn: env.SENTRY_DSN, // empty/undefined => Sentry effectively disabled
	environment: env.NODE_ENV,
	tracesSampleRate: Number(env.SENTRY_TRACES_SAMPLE_RATE ?? 0),
});
