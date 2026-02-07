//! public/js/home/about.js

/**
 * Handle tab switching logic for the About section.
 * Toggles active tab links and corresponding content panels.
 */

// Ensure tabs exist before binding events
if (tabLinks.length && tabContents.length) {
	tabLinks.forEach((tabLink) => {
		tabLink.addEventListener('click', (event) => {
			// Reset active states
			tabLinks.forEach((link) => link.classList.remove('active'));
			tabContents.forEach((content) =>
				content.classList.remove('active-tab')
			);

			// Activate clicked tab
			const el = event.currentTarget;
			el.classList.add('active');

			// Show matching tab content
			const targetTab = document.getElementById(el.dataset.tab);
			if (targetTab) targetTab.classList.add('active-tab');
		});
	});
}
