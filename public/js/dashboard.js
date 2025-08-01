//! public/js/dashboard.js

let usernameCheckTimeout;

// Get all relevant DOM elements once
const usernameEl = document.getElementById('username-value');
const inputEl = document.getElementById('username-input');
const formEl = document.getElementById('username-form');
const editBtn = document.getElementById('edit-username-btn');
const cancelBtn = document.getElementById('cancel-edit-btn');
const submitBtn = document.getElementById('submit-username-btn');
const feedbackEl = document.getElementById('username-feedback');
const messagesEl = document.getElementById('username-messages');

const MESSAGES = {
	username_updated:
		messagesEl?.dataset.updated || 'Username has been updated.',
	username_taken: messagesEl?.dataset.taken || 'Username taken.',
	invalid: messagesEl?.dataset.invalid || 'Invalid username.',
	username_available: messagesEl?.dataset.available || 'Username available.',
	username_error: messagesEl?.dataset.error || 'Error checking username.',
};

const currentUsername = inputEl?.dataset.current?.trim();

// Helpers
const show = (el) => el?.classList.remove('hidden');
const hide = (el) => el?.classList.add('hidden');
const setFeedback = (msg, type) => {
	if (!feedbackEl) return;
	feedbackEl.textContent = msg;
	feedbackEl.classList.remove('text-success', 'text-danger');
	feedbackEl.classList.add(
		type === 'success' ? 'text-success' : 'text-danger'
	);
	show(feedbackEl);
};

const resetFormDisplay = (editing = false) => {
	if (editing) {
		hide(usernameEl);
		hide(editBtn);
		show(formEl);
	} else {
		show(usernameEl);
		show(editBtn);
		hide(formEl);
	}
};

const updateUsernameDOM = (username) => {
	if (usernameEl) usernameEl.textContent = username;
	resetFormDisplay(false);
	hide(feedbackEl); // ✅ hide feedback on success
	showFlashMessage('✅ ' + MESSAGES.username_updated, 'success');
};

// Events
editBtn?.addEventListener('click', () => resetFormDisplay(true));
cancelBtn?.addEventListener('click', () => resetFormDisplay(false));

submitBtn?.addEventListener('click', async () => {
	const username = inputEl.value.trim();
	hide(feedbackEl);

	if (username === currentUsername) {
		updateUsernameDOM(username);
		return;
	}

	try {
		const res = await fetch('/auth/update-username', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({ username }),
		});
		const result = await res.json();

		if (!res.ok)
			throw new Error(`❌ ${result.error}` || 'Something went wrong');
		updateUsernameDOM(username);
	} catch (err) {
		setFeedback(err.message, 'danger');
		showFlashMessage(err.message, 'danger');
	}
});

inputEl?.addEventListener('input', () => {
	clearTimeout(usernameCheckTimeout);

	const username = inputEl.value.trim();
	hide(feedbackEl);
	feedbackEl.classList.remove('text-success', 'text-danger');

	if (username.length < 3) return;

	if (username === currentUsername) {
		setFeedback(MESSAGES.username_available, 'success');
		return;
	}

	usernameCheckTimeout = setTimeout(async () => {
		try {
			const res = await fetch(
				`/auth/check-username?username=${encodeURIComponent(username)}`
			);
			const result = await res.json();

			if (!result.available) {
				const msg =
					result.reason === 'invalid'
						? MESSAGES.invalid
						: MESSAGES.username_taken;
				setFeedback(msg, 'danger');
			} else {
				setFeedback(MESSAGES.username_available, 'success');
			}
		} catch (err) {
			setFeedback(`⚠️ ${MESSAGES.username_error}`, 'danger');
			console.error(err);
		}
	}, 400);
});
