//! public/js/social.js

const socialToggle = document.getElementById('socialToggle');
const socialPanel = document.getElementById('socialPanel');
const closePanelBtn = document.getElementById('closeSocialPanel');
const groupHeader = document.querySelectorAll('.group-header');

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

// Close on Escape
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && socialPanel.classList.contains('open')) {
		closePanel();
	}
});

// Expand/collapse logic
groupHeader.forEach((header) => {
	header.addEventListener('click', () => {
		const group = header.closest('.social-group');
		const isOpen = group.classList.contains('open');

		// Collapse all
		document.querySelectorAll('.social-group.open').forEach((openGroup) => {
			openGroup.classList.remove('open');
		});

		// Toggle clicked one
		if (!isOpen) {
			group.classList.add('open');
		}
	});
});
