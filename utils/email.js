//! utils/email.js

import env from '../config/dotenv.js';
import transporter from '../config/nodemailer.js';
import { reportError } from '../config/sentry.js';

const companyName = 'Dakermanji {Web Dev}';

export async function sendSignupEmail(to, link) {
	const from = `${companyName} <${env.EMAIL_USER}>`;
	const subject = companyName;
	const html = `
			<p>${companyName}</p>
			<p>Please click the link below to complete your registration (expire in 1 hour)</p>
			<p>Veuillez cliquer sur le lien ci-dessous pour finaliser votre inscription (expire dans 1 heure).</p>
			<p>يرجى النقر على الرابط أدناه لإكمال عملية التسجيل (تنتهي صلاحيته خلال ساعة واحدة).</p>
			<p><a href="${link}">${link}</a></p>
		`;

	try {
		const info = await transporter.sendMail({ from, to, subject, html });
		console.log(`[mailer] Signup email sent to ${to}: ${info.messageId}`);
	} catch (error) {
		reportError(new Error(error));
	}
}

export async function sendResetPasswordEmail(to, link) {
	const from = `${companyName} <${env.EMAIL_USER}>`;
	const subject = companyName;

	const html = `
		<p><strong>${companyName}</strong></p>
		<p>You requested to reset your password.</p>
		<p>Vous avez demandé à réinitialiser votre mot de passe.</p>
		<p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك.</p>
		<p><a href="${link}">${link}</a></p>
	`;

	try {
		await transporter.sendMail({ from, to, subject, html });
	} catch (error) {
		reportError(new Error(error));
	}
}
