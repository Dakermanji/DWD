//! utils/mail/sendSignupEmail.js

/**
 * Signup email sender
 * -------------------
 * Sends the email used to complete email-first registration.
 *
 * Notes:
 * - Receives the RAW token (never stored in DB).
 * - Token hashing and expiry are handled elsewhere.
 * - This function is intentionally simple and focused.
 */

import transporter from '../../config/nodemailer.js';
import env from '../../config/dotenv.js';
import { getMessages } from '../../data/messages.js';

const sendSignupEmail = async ({ to, token, lang }) => {
	const msg = getMessages('signup', lang);
	const isRTL = lang === 'ar';

	const signupUrl = `${env.SITE_URL}/auth/complete-signup/${encodeURIComponent(token)}`;

	await transporter.sendMail({
		from: env.EMAIL_FROM,
		to,
		subject: msg.subject,
		text: `${msg.intro}\n\n${msg.body}\n\n${signupUrl}\n\n${msg.footer}`.trim(),
		html: `
            <div ${isRTL ? 'dir="rtl"' : ''} style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p>${msg.intro}</p>
                <p>${msg.body}</p>
                <p>
                    <a href="${signupUrl}"  rel="noopener noreferrer" style="display:inline-block;padding:10px 14px;text-decoration:none;border-radius:6px;border:1px solid #333;">
                        ${msg.button}
                    </a>
                </p>

                <p style="opacity:0.85;">${msg.footer}</p>
                <p style="font-size:12px;opacity:0.7;">${signupUrl}</p>
            </div>
		`.trim(),
	});
};

export default sendSignupEmail;
