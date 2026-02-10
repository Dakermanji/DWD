//! data/messages.js

/**
 * Signup email messages
 * ---------------------
 * Centralized localized content for signup emails.
 */
const MESSAGES = {
	// Signup email messages
	signup: {
		en: {
			subject: 'Complete your registration',
			intro: 'Welcome!',
			body: 'To finish creating your account, click the link below:',
			button: 'Complete registration',
			footer: 'This link will expire soon. If you didn’t request this, you can safely ignore this email.',
		},
		fr: {
			subject: 'Finalisez votre inscription',
			intro: 'Bienvenue !',
			body: 'Pour terminer la création de votre compte, cliquez sur le lien ci-dessous :',
			button: 'Finaliser l’inscription',
			footer: 'Ce lien expirera bientôt. Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet e-mail.',
		},
		ar: {
			subject: 'أكمِل إنشاء حسابك',
			intro: 'مرحباً!',
			body: 'لإكمال إنشاء حسابك، اضغط على الرابط أدناه:',
			button: 'إكمال التسجيل',
			footer: 'ستنتهي صلاحية هذا الرابط قريباً. إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة بأمان.',
		},
	},
};
export const getMessages = (type, lang = 'en') =>
	MESSAGES[type]?.[lang] ?? MESSAGES[type]?.en;
