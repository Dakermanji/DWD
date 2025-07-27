//! public/js/index/main.js

// Mouse move effect to adjust transparency around cursor within the hero section
main.addEventListener('mousemove', (event) => {
	const overlay = main.querySelector('main>.background-overlay');
	const { clientX: x, clientY: y } = event;

	// Update the position of the radial gradient based on the cursor's position within the hero section
	overlay.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 0, 0, 0) 0%, rgba(100, 100, 255, 0.4) 50%)`;
});

// Handle tab switching for the About section
tabLinks.forEach((tabLink) => {
	tabLink.addEventListener('click', function () {
		// Remove 'active' class from all tab-links and tab-contents
		tabLinks.forEach((link) => link.classList.remove('active'));

		tabContents.forEach((content) =>
			content.classList.remove('active-tab')
		);

		// Add 'active' class to the clicked tab and its content
		this.classList.add('active');
		const targetTab = document.getElementById(this.dataset.tab);
		if (targetTab) {
			targetTab.classList.add('active-tab');
		}
	});
});

// Function to calculate how many projects fit per row
function getProjectsPerRow() {
	// Temporarily make one project visible to measure its width
	projects[0].classList.add('visible');
	const projectWidth = projects[0].offsetWidth + 31.6667;

	projects[0].classList.remove('visible');

	const containerWidth = workContainer.offsetWidth;

	// Calculate how many projects can fit in one row
	return Math.floor(containerWidth / projectWidth);
}

let projectsPerRow = getProjectsPerRow();
let visibleProjects = projectsPerRow;

// Function to show projects based on how many fit in a row
function showProjects() {
	// Show only the visible projects
	for (let i = 0; i < visibleProjects; i++) {
		if (projects[i]) {
			projects[i].classList.add('visible');
		}
	}

	// Hide the button if all projects are visible
	if (visibleProjects >= projects.length) {
		seeMoreBtn.style.display = 'none';
	} else {
		seeMoreBtn.style.display = 'inline-block'; // Make sure the button is visible if needed
	}
}

// Function to handle "See More" button clicks
function handleSeeMore() {
	// Increase the number of visible projects by one row
	visibleProjects += projectsPerRow;
	showProjects();
}

// Adjust project visibility based on the initial load and resizing
showProjects();

// Attach click event to the "See More" button
seeMoreBtn.addEventListener('click', handleSeeMore);

// Recalculate projects per row on window resize and adjust visible projects
let resizeTimeout;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {
		// Recalculate how many projects fit per row
		projectsPerRow = getProjectsPerRow();
		// Reset visible projects based on the recalculated projects per row
		visibleProjects = projectsPerRow;
		// Hide all projects
		projects.forEach((proj) => proj.classList.remove('visible'));
		// Show the initial set based on new screen size
		showProjects();
	}, 200); // Adjust debounce delay as needed
});
