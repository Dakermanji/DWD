//! public/js/header.js

// Initialize tooltips
const tooltipTriggerList = Array.from(
	document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
const tooltips = tooltipTriggerList.map((el) => new bootstrap.Tooltip(el));

// Target all collapsible navbars
const navbarCollapses = document.querySelectorAll('.navbar-collapse');

// Collapse navbar on outside click (except dropdowns & notifications)
document.addEventListener('click', (event) => {
	const isDropdownOrNotificationClick =
		event.target.closest('.dropdown-menu') ||
		event.target.closest('#notifications-trigger') ||
		event.target.closest('#notifications li') ||
		event.target.closest('#langDropdown');

	if (isDropdownOrNotificationClick) return;

	setTimeout(() => {
		navbarCollapses.forEach((collapseEl) => {
			if (collapseEl.classList.contains('show')) {
				const collapseInstance =
					bootstrap.Collapse.getInstance(collapseEl);
				collapseInstance?.hide();
			}
		});
	}, 10);
});
