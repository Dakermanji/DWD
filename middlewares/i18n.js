//! middlewares/i18n.js

import i18n from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';
import { logMiddlewareErrors } from './helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18n.configure({
	locales: ['en', 'fr', 'ar'],
	defaultLocale: 'en',
	directory: path.join(__dirname, '../locales'),
	autoReload: true,
	updateFiles: false,
	syncFiles: false,
	cookie: 'lang',
	objectNotation: true,
});

export const i18nMiddleware = (app) => {
	app.use(logMiddlewareErrors(i18n.init));
};
