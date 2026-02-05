//! middlewares/ejs.js

/**
 * EJS view engine middleware
 * --------------------------
 * Configures EJS as the view engine and enables express-ejs-layouts.
 *
 * Kept separate from core Express middleware to keep concerns clean:
 * - middlewares/express.js handles static + parsing
 * - middlewares/ejs.js handles rendering concerns (views/layouts)
 */

import path from 'path';
import { fileURLToPath } from 'url';
import expressLayouts from 'express-ejs-layouts';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ejsMiddlewares = (app) => {
	// View engine configuration
	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, '..', 'views'));

	// Layout system (wraps rendered pages inside a shared layout)
	app.use(expressLayouts);

	/**
	 * Default layout file (relative to /views)
	 * Examples:
	 * - views/layout.ejs           -> 'layout'
	 * - views/layouts/main.ejs     -> 'layouts/main'
	 */
	app.set('layout', 'layout');
};

export default ejsMiddlewares;
