//! public/js/root.js

/**
 * Global UI behaviors
 * -------------------
 * - Auto-dismisses flash messages after a short delay
 * - Initializes and manages Bootstrap tooltips
 *
 * Notes:
 * - This file is loaded globally for all pages.
 * - Assumes Bootstrap JS bundle is available on window.
 */

/**
 * Automatically fade out and remove flash messages.
 * Uses CSS transitions when available, with a JS fallback.
 */
setTimeout(() => {
	document.querySelectorAll('.flash-message').forEach((msg) => {
		// Skip if the element was already removed
		if (!document.body.contains(msg)) return;

		// Trigger CSS fade-out
		msg.classList.add('fade');

		// Remove element after transition completes
		msg.addEventListener(
			'transitionend',
			() => {
				msg.remove();
			},
			{ once: true }
		);

		// Fallback in case transitionend doesn’t fire
		setTimeout(() => {
			if (document.body.contains(msg)) {
				msg.remove();
			}
		}, 1000);
	});
}, 3000);

/**
 * Hides all active Bootstrap tooltips.
 * Useful before collapsing menus or changing UI state.
 */
function hideAllTooltips() {
	const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
	tooltips.forEach((el) => {
		const instance = bootstrap.Tooltip.getInstance(el);
		if (instance) {
			instance.hide();
		}
	});
}

/**
 * Initializes Bootstrap tooltips within a given DOM scope.
 * Can be reused for dynamically injected content.
 *
 * @param {Document|Element} scope - Root element to scan for tooltips
 */
function initTooltipsIn(scope = document) {
	const nodes = scope.querySelectorAll('[data-bs-toggle="tooltip"]');
	nodes.forEach((el) => {
		// Bootstrap 5: safely reuse if exists, create if not
		bootstrap.Tooltip.getOrCreateInstance(el);
	});
}

// Initialize tooltips on initial page load
initTooltipsIn(document);
