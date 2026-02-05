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
import router from './routes.js';
import applyMiddlewares from './middleware.js';

// Create the Express application instance
const app = express();

// Apply global middlewares (body parsers, security, etc.)
applyMiddlewares(app);

// Register application routes
app.use('/', router);

// Export the app to be used by the server entry point
export default app;
