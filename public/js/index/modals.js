//! public/js/index/modals.js

if (authModalState) {
	if (authModalState.dataset.show === 'true') {
		new bootstrap.Modal(document.getElementById('authModal')).show();
	}

	const tab = authModalState.dataset.tab;
	const email = authModalState.dataset.registerEmail;

	if (tab === 'register') {
		const tabBtn = document.querySelector('#register-tab');
		if (tabBtn) tabBtn.click();
	}

	if (email) {
		const input = document.querySelector('#registerEmail');
		if (input) input.value = email;
	}
}

if (setUsernameModal) {
	new bootstrap.Modal(setUsernameModal).show();
}

if (resetTrigger) {
	resetTrigger.addEventListener('click', (e) => {
		e.preventDefault();

		const authModalEl = document.getElementById('authModal');
		const resetModalEl = document.getElementById('resetPasswordModal');

		const authInstance = bootstrap.Modal.getInstance(authModalEl);
		if (authInstance) {
			authInstance.hide();

			authModalEl.addEventListener('hidden.bs.modal', function handler() {
				authModalEl.removeEventListener('hidden.bs.modal', handler);
				const resetInstance = new bootstrap.Modal(resetModalEl);
				resetInstance.show();
			});
		} else {
			const resetInstance = new bootstrap.Modal(resetModalEl);
			resetInstance.show();
		}
	});
}

if (setPasswordModal) {
	new bootstrap.Modal(setPasswordModal).show();
}
