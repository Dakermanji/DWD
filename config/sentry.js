//! config/sentry.js

import * as Sentry from '@sentry/node';
import integrations from '@sentry/integrations';
import env from './dotenv.js';

const { httpRouter } = integrations;

export const initSentry = (app) => {
	if (!env.SENTRY_DSN) return;

	Sentry.init({
		dsn: `https://${env.SENTRY_DSN}.ingest.us.sentry.io/${env.SENTRY_PROJECT_ID}`,
		integrations: [httpRouter({ app })],
		tracesSampleRate: 1.0,
		environment: env.NODE_ENV,
	});

	app.use(Sentry.Handlers.requestHandler());
	app.use(Sentry.Handlers.tracingHandler());
};

// Wrapped capture helper
export const reportError = (err) => {
	if (env.SENTRY_DSN) {
		Sentry.captureException(err);
	}
};
