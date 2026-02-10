//! public/js/modals/auth.js

/**
 * Auth modal controller
 * ---------------------
 * - Opens #authModal when server sets flash.modal to 'login' or 'register'
 * - Switches to the correct tab based on data attributes in #authModalState
 *
 * Requirements:
 * - Bootstrap JS loaded globally (window.bootstrap)
 */

document.addEventListener('DOMContentLoaded', () => {
	const stateEl = document.getElementById('authModalState');
	const modalEl = document.getElementById('authModal');
	if (!stateEl || !modalEl) return;

	const modalName = stateEl.dataset.modal; // 'login' | 'register' | ''
	const defaultTab = stateEl.dataset.defaultTab || 'login';

	// Only auto-open for these states
	if (modalName !== 'login' && modalName !== 'register') return;

	// Open modal
	if (!window.bootstrap?.Modal) return;
	const instance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
	instance.show();

	// Activate tab
	if (window.bootstrap?.Tab) {
		const tabButton =
			defaultTab === 'register'
				? document.getElementById('auth-register-tab')
				: document.getElementById('auth-login-tab');

		if (tabButton) {
			window.bootstrap.Tab.getOrCreateInstance(tabButton).show();
		}
	}
});
