//! public/js/dashboard.js

let usernameCheckTimeout;

const messagesEl = document.getElementById('username-messages');
const MESSAGES = {
	username_updated: messagesEl?.dataset.updated || 'Updated',
	username_taken: messagesEl?.dataset.taken || 'Taken',
	invalid_username: messagesEl?.dataset.invalid || 'Invalid',
	username_available: messagesEl?.dataset.available || 'Available',
	username_error: messagesEl?.dataset.error || 'Error checking username',
	username_updated:
		messagesEl?.dataset.updated || 'Username has been updated',
};

const updateUsernameDOM = (username) => {
	document.getElementById('username-value').textContent = username;
	document.getElementById('username-value').classList.remove('hidden');
	document.getElementById('edit-username-btn').classList.remove('hidden');
	document.getElementById('username-form').classList.add('hidden');
	showFlashMessage(
		'✅ ' + MESSAGES.username_updated || 'Username updated!',
		'success'
	);
};

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

document
	.getElementById('submit-username-btn')
	?.addEventListener('click', async () => {
		const input = document.getElementById('username-input');
		const currentUsername = input?.dataset.current?.trim();
		const feedback = document.getElementById('username-feedback');
		const username = input.value.trim();

		feedback.textContent = '';
		feedback.classList.add('hidden');

		if (username === currentUsername) {
			feedback.textContent = MESSAGES.available;
			feedback.classList.add('text-success');
			feedback.classList.remove('text-danger');
			feedback.classList.remove('hidden');
			updateUsernameDOM(username, MESSAGES.username_updated);
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
				throw new Error(result.error || 'Something went wrong');

			// Success: update DOM
			updateUsernameDOM(username, MESSAGES.username_updated);
		} catch (err) {
			feedback.textContent = err.message;
			feedback.classList.remove('hidden');
			showFlashMessage(err.message, 'danger');
		}
	});

const usernameInput = document.getElementById('username-input');
usernameInput?.addEventListener('input', () => {
	clearTimeout(usernameCheckTimeout);

	const feedback = document.getElementById('username-feedback');
	const username = usernameInput.value.trim();
	const currentUsername = usernameInput?.dataset.current?.trim();
	feedback.textContent = '';
	feedback.classList.remove('text-danger', 'text-success');

	if (username.length < 3) return;

	if (username === currentUsername) {
		feedback.textContent = MESSAGES.username_available;
		feedback.classList.add('text-success');
		feedback.classList.remove('text-danger');
		feedback.classList.remove('hidden');
		return;
	}

	usernameCheckTimeout = setTimeout(async () => {
		try {
			const res = await fetch(
				`/auth/check-username?username=${encodeURIComponent(username)}`
			);
			const result = await res.json();

			console.log(result);
			if (!result.available) {
				feedback.textContent =
					result.reason === 'invalid'
						? MESSAGES.username_updated
						: MESSAGES.username_taken;
				feedback.classList.add('text-danger');
			} else {
				feedback.textContent = MESSAGES.username_available;
				feedback.classList.add('text-success');
			}
		} catch (err) {
			feedback.textContent = `⚠️ ${MESSAGES.username_error}`;
			console.log(err);
			feedback.classList.add('text-danger');
		}
	}, 400);
});
