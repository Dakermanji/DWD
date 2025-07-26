//! public/js/root.js

setTimeout(() => {
	document.querySelectorAll('.flash-message').forEach((msg) => {
		if (!document.body.contains(msg)) return;

		msg.classList.add('fade');

		msg.addEventListener(
			'transitionend',
			() => {
				msg.remove();
			},
			{ once: true }
		);

		// Fallback in case transitionend doesn’t fire
		setTimeout(() => {
			if (document.body.contains(msg)) {
				msg.remove();
			}
		}, 1000);
	});
}, 3000);
