//! config/express.js

/**
 * Express application configuration
 * ---------------------------------
 * Creates the Express app, applies global middleware,
 * and attaches the main router.
 *
 * No server is started here on purpose.
 * This separation allows:
 * - Easier testing
 * - Cleaner architecture
 * - Reuse of the app instance (e.g. HTTP server, WebSockets)
 */

import express from 'express';
import * as Sentry from '@sentry/node';
import router from './routes.js';
import applyMiddlewares from './middleware.js';
import { notFound, errorHandler } from '../middlewares/errors.js';

// Create the Express application instance
const app = express();

// Apply global middlewares (body parsers, security, etc.)
applyMiddlewares(app);

// Register application routes
app.use('/', router);

// 404 creator (turns missing routes into errors)
app.use(notFound);

/**
 * Sentry error handler should be registered before any other error middleware.
 * This ensures Sentry captures errors, while our errorHandler still formats responses.
 */
Sentry.setupExpressErrorHandler(app);

// Error handling must be registered after routes
app.use(errorHandler);

// Export the app to be used by the server entry point
export default app;
