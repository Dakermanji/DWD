//! public/js/index/password.js

const passwordInput = document.getElementById('set-password');
const bar = document.getElementById('password-bar');

const colors = [
	'#c0392b', // very weak
	'#e67e22', // weak
	'#f1c40f', // fair
	'#27ae60', // strong
	'#2ecc71', // very strong
];

function isTooCommon(password) {
	const lower = password.toLowerCase();
	return COMMON_PASSWORDS.includes(lower);
}

function basicRequirements(password) {
	return (
		/[a-z]/.test(password) &&
		/[A-Z]/.test(password) &&
		/\d/.test(password) &&
		/[^A-Za-z0-9]/.test(password) &&
		password.length >= 8
	);
}

passwordInput.addEventListener('input', () => {
	const result = zxcvbn(passwordInput.value);
	let score = result.score;

	if (
		!basicRequirements(passwordInput.value) ||
		isTooCommon(passwordInput.value)
	) {
		score = 1; // Override if weak
	}

	bar.style.width = `${(score + 1) * 20}%`;
	bar.style.backgroundColor = colors[score];
});
