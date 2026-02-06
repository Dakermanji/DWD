//! config/i18n.js

/**
 * i18n configuration (i18next)
 * ----------------------------
 * - Loads translation resources from /locales
 * - Initializes i18next
 * - Enables language detection (cookie -> header)
 *
 * Notes:
 * - This project uses ESM, so we build __dirname manually.
 * - We configure detection in i18next.init so it becomes the single source of truth.
 */

import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads and parses a JSON file relative to the project root.
 * Throws a readable error if the file cannot be loaded.
 */
const loadJson = (relativePath) => {
	const fullPath = path.join(__dirname, '..', relativePath);

	try {
		return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
	} catch (err) {
		throw new Error(`[i18n] Failed to load translation file: ${fullPath}`);
	}
};

// Translation resources (namespace: "common")
const resources = {
	en: { common: loadJson('locales/en/common.json') },
	fr: { common: loadJson('locales/fr/common.json') },
	ar: { common: loadJson('locales/ar/common.json') },
};

// Enable language detection plugin (required for cookie/header detection)
i18next.use(i18nextMiddleware.LanguageDetector);

await i18next.init({
	// Keep language resolution predictable (e.g. "fr-CA" -> "fr")
	load: 'languageOnly',

	supportedLngs: ['en', 'fr', 'ar'],
	nonExplicitSupportedLngs: true,

	resources,
	fallbackLng: 'en',

	defaultNS: 'common',
	ns: ['common', 'flash'],

	// EJS escapes output by default; we don't want double-escaping
	interpolation: { escapeValue: false },

	// Avoid returning empty strings/nulls silently (helps catch missing content)
	returnNull: false,
	returnEmptyString: false,

	// Language detection configuration (single source of truth)
	detection: {
		order: ['cookie', 'header'],
		lookupCookie: 'lang',
		caches: ['cookie'],
	},
});

export default i18next;
