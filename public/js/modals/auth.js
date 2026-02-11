//! public/js/modals/auth.js

/**
 * Auth Modal Controller
 * ---------------------
 * Centralized client-side logic for automatically opening
 * authentication-related modals based on server-provided state.
 *
 * Flow:
 * - Server sets a flash key: req.flash('modal', 'login' | 'register' | 'completeSignup_*')
 * - Layout injects #authModalState with data attributes
 * - This script reads that state and opens the appropriate Bootstrap modal
 *
 * Safety:
 * - Does nothing if user is already authenticated
 * - Does nothing if modal state is missing or invalid
 * - Fails gracefully if Bootstrap is not available
 */

document.addEventListener('DOMContentLoaded', () => {
	// Read modal state injected by server into layout
	const stateEl = document.getElementById('authModalState');
	if (!stateEl) return; // No modal state present → nothing to do

	// Extract modal-related state from data attributes
	const modalName = stateEl.dataset.modal || '';
	const defaultTab = stateEl.dataset.defaultTab || 'login';
	const isAuthed = stateEl.dataset.isAuthed === '1';

	// Prevent auth modals from opening for logged-in users
	if (isAuthed) return;

	/**
	 * Mapping between modal state values and actual modal DOM IDs.
	 *
	 * type:
	 * - 'authTabs' → login/register shared modal with tabs
	 * - 'completeSignup' → username/password completion modal
	 */
	const MODALS = {
		login: { id: 'authModal', type: 'authTabs' },
		register: { id: 'authModal', type: 'authTabs' },

		completeSignup_local: {
			id: 'setUsernameModal',
			type: 'completeSignup',
		},
		completeSignup_oauth: {
			id: 'setUsernameModal',
			type: 'completeSignup',
		},
	};

	// Resolve requested modal configuration
	const target = MODALS[modalName];
	if (!target) return; // Unknown modal key → ignore safely

	// Ensure Bootstrap modal API is available
	if (!window.bootstrap?.Modal) return;

	// Locate the modal element in DOM
	const modalEl = document.getElementById(target.id);
	if (!modalEl) return;

	// Open modal using Bootstrap's safe instance getter
	bootstrap.Modal.getOrCreateInstance(modalEl).show();

	/**
	 * If this is the login/register modal,
	 * activate the correct tab after opening.
	 */
	if (target.type === 'authTabs' && window.bootstrap?.Tab) {
		const tabButton =
			defaultTab === 'register'
				? document.getElementById('auth-register-tab')
				: document.getElementById('auth-login-tab');

		if (tabButton) {
			bootstrap.Tab.getOrCreateInstance(tabButton).show();
		}
	}
});
