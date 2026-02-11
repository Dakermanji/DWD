//! config/languages.js

/**
 * Supported languages / locales configuration
 * ------------------------------------------
 * - Defines UI languages available in the application
 * - Used for rendering the language selector dynamically
 *
 * Notes:
 * - Flags map to /public/images/flags/<flag>.svg
 */

export const SUPPORTED_LANGUAGES = [
	{ code: 'ar', flag: 'sy', name: 'العربية' },
	{ code: 'en', flag: 'ca', name: 'English' },
	{ code: 'fr', flag: 'qc', name: 'Français' },
];

export const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((l) => l.code);

export const SUPPORTED_LANGUAGE_SET = new Set(SUPPORTED_LANGUAGE_CODES);
