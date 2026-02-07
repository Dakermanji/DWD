//! public/js/home/background.js
/**
 * Interactive background glow effect for the home hero section.
 * Creates a cursor-following radial gradient to enhance depth.
 */

let rafId = null;

// Mouse-move driven glow (throttled via requestAnimationFrame)
main?.addEventListener('mousemove', (event) => {
	if (rafId || !overlay) return;

	rafId = requestAnimationFrame(() => {
		const rect = main.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		overlay.style.background = `
			radial-gradient(
				circle at ${x}px ${y}px,
				rgba(255, 255, 255, 0.0) 0%,
				rgba(120, 140, 255, 0.35) 20%,
				rgba(40, 60, 120, 0.45) 30%
			)
		`;

		rafId = null;
	});
});

// Reset glow when cursor leaves the main area
main?.addEventListener('mouseleave', () => {
	if (!overlay) return;

	overlay.style.background = `
		radial-gradient(
			circle at 10% 50%,
			rgba(0,0,0,0) 0%,
			rgba(100,100,255,0.4) 50%
		)
	`;
});

// Disable effect on touch devices
if ('ontouchstart' in window && overlay) {
	overlay.style.background = 'none';
}
