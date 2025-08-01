//! public/js/internal_flash.js

const flashMessages = document.querySelectorAll('.flash-message');

flashMessages.forEach((el) => {
	setTimeout(() => {
		// Bootstrap handles this via data-bs-dismiss + fade
		const alert = bootstrap.Alert.getOrCreateInstance(el);
		alert.close();
	}, 3000);
});

function showFlashMessage(message, type = 'danger') {
	const container = document.createElement('div');
	container.className = `alert alert-${type} alert-dismissible fade show flash-message`;
	container.role = 'alert';
	container.innerHTML = `
		${message}
		<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
	`;

	document.body.prepend(container);

	setTimeout(() => {
		const alert = bootstrap.Alert.getOrCreateInstance(container);
		alert.close();
	}, 3000);
}
