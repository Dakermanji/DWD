//! utils/respond.js

export function respondWithFlashOrJson(req, res, statusCode, flashKey) {
	if (req.headers.accept === 'application/json') {
		return res
			.status(statusCode)
			.json({ error: req.__(`flash.${flashKey}`) });
	}
	req.flash('error', flashKey);
	return res.redirect('/dashboard');
}
