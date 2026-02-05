//! server.js

/**
 * Application entry point
 * -----------------------
 * This file is responsible for starting the HTTP server.
 * It imports the configured Express app and binds it
 * to a network port.
 */

import app from './config/express.js';

// Start the Express server and listen for incoming requests
app.listen(3000, () => {
	console.log('Server is running on localhost:3000');
});
