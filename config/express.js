//! config/express.js

/**
 * Express application configuration
 * ---------------------------------
 * This file is responsible for creating and exporting
 * the Express app instance.
 *
 * No server is started here on purpose.
 * This separation allows:
 * - Easier testing
 * - Cleaner architecture
 * - Reuse of the app instance (e.g. HTTP server, WebSockets)
 */

import express from 'express';

// Create the Express application instance
const app = express();

// Export the app to be used by the server entry point
export default app;
