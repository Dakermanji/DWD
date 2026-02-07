//! public/js/home/portfolio.js

/**
 * Portfolio "See More" behavior
 * -----------------------------
 * - Calculates how many project cards fit per row.
 * - Initially shows one row of projects.
 * - Reveals one additional row each time the button is clicked.
 * - Recalculates layout on window resize.
 */

/**
 * Calculate how many project cards fit in a single row
 * based on container width and card size.
 */
function getProjectsPerRow() {
	// No projects available
	if (!projects.length) return 0;

	// Read the grid gap dynamically from CSS
	const gap = parseFloat(getComputedStyle(workContainer).gap) || 0;

	// Width of a single project card (including gap)
	const projectWidth = projects[0].offsetWidth + gap;

	// Available width for the grid
	const containerWidth = workContainer.offsetWidth;

	// Always show at least one project per row
	return Math.max(1, Math.floor(containerWidth / projectWidth));
}

// Initial layout calculations
let projectsPerRow = getProjectsPerRow();
let visibleProjects = projectsPerRow;

/**
 * Show currently allowed number of projects
 * and toggle the visibility of the "See more" button.
 */
function showProjects() {
	for (let i = 0; i < visibleProjects; i++) {
		projects[i]?.classList.add('visible');
	}

	// Hide button when all projects are visible
	seeMoreBtn.style.display =
		visibleProjects >= projects.length ? 'none' : 'inline-block';
}

/**
 * Handle "See more" button click
 * Reveals one additional row of projects.
 */
function handleSeeMore() {
	visibleProjects += projectsPerRow;
	showProjects();
}

// Initial render
showProjects();
seeMoreBtn.addEventListener('click', handleSeeMore);

// Recalculate layout on window resize (debounced)
let resizeTimeout;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimeout);

	resizeTimeout = setTimeout(() => {
		// Recalculate row capacity
		projectsPerRow = getProjectsPerRow();
		visibleProjects = projectsPerRow;

		// Reset visibility and re-render
		projects.forEach((proj) => proj.classList.remove('visible'));
		showProjects();
	}, 200);
});
