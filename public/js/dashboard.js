//! public/js/dashboard.js

document.getElementById('edit-username-btn')?.addEventListener('click', () => {
	document.getElementById('username-value').classList.add('hidden');
	document.getElementById('edit-username-btn').classList.add('hidden');
	document.getElementById('username-form').classList.remove('hidden');
});

document.getElementById('cancel-edit-btn')?.addEventListener('click', () => {
	document.getElementById('username-value').classList.remove('hidden');
	document.getElementById('edit-username-btn').classList.remove('hidden');
	document.getElementById('username-form').classList.add('hidden');
});
