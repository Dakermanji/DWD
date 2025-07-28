//! utils/email.js

import transporter from '../../config/nodemailer.js';

export async function sendSignupEmail(to, link) {
	const info = await transporter.sendMail({
		from: `"Dakermanji Web" <${process.env.MAIL_USER}>`,
		to,
		subject: 'Confirm your registration',
		html: `
			<p>Thanks for signing up!</p>
			<p>Please click the link below to complete your registration:</p>
			<p><a href="${link}">${link}</a></p>
			<p>This link will expire in 1 hour.</p>
		`,
	});

	console.log(`[mailer] Signup email sent to ${to}: ${info.messageId}`);
}
