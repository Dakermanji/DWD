//! public/js/social.js

const socialToggle = document.getElementById('socialToggle');
const socialPanel = document.getElementById('socialPanel');
const closePanelBtn = document.getElementById('closeSocialPanel');

const openPanel = () => socialPanel.classList.add('open');
const closePanel = () => socialPanel.classList.remove('open');

socialToggle.addEventListener('click', (e) => {
	e.preventDefault();
	socialPanel.classList.toggle('open');
});

closePanelBtn?.addEventListener('click', closePanel);

// Close on outside click
document.addEventListener('click', (e) => {
	if (
		socialPanel.classList.contains('open') &&
		!socialPanel.contains(e.target) &&
		!socialToggle.contains(e.target)
	) {
		closePanel();
	}
});

// Optional: close on Escape
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && socialPanel.classList.contains('open')) {
		closePanel();
	}
});
