//! public/js/header.js

/**
 * Header / navbar behaviors
 * -------------------------
 * - Collapses the mobile navbar when clicking outside of it
 * - Preserves expected Bootstrap dropdown interactions
 *
 * Notes:
 * - Designed for Bootstrap 5 navbar behavior.
 * - Assumes Bootstrap JS bundle is available globally.
 */

// Target all collapsible navbars (mobile view)
const navbarCollapses = document.querySelectorAll('.navbar-collapse');

/**
 * Collapse open navbars when clicking outside,
 * while ignoring interactions inside dropdowns.
 */
document.addEventListener('click', (event) => {
	// Check if the click occurred inside an open dropdown
	const inOpenDropdown =
		event.target.closest('.dropdown-menu.show') ||
		event.target.closest(
			'[data-bs-toggle="dropdown"][aria-expanded="true"]'
		);

	// Allow normal dropdown interaction
	if (inOpenDropdown) return;

	// Defer collapse slightly to avoid race conditions
	// with Bootstrap's internal click handlers
	setTimeout(() => {
		navbarCollapses.forEach((collapseEl) => {
			if (collapseEl.classList.contains('show')) {
				const collapseInstance =
					bootstrap.Collapse.getInstance(collapseEl);

				// Safely hide if an instance exists
				collapseInstance?.hide();
			}
		});
	}, 10);
});
