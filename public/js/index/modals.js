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
