//! controllers/auth.js

export function postLogin(req, res, next) {
	// TODO: handled by passport-local
}

export function postRegisterEmail(req, res, next) {
	// TODO: validate + insert email, generate token, send email
}

export function getConfirmRegister(req, res, next) {
	// TODO: validate token, show setUsernameModal
}

export function postCompleteAccount(req, res, next) {
	// TODO: set username + password, login user
}

export function postRequestReset(req, res, next) {
	// TODO: send reset token via email
}

export function getResetForm(req, res, next) {
	// TODO: verify token, show reset modal
}

export function postResetPassword(req, res, next) {
	// TODO: update password for user
}

export function postLogout(req, res) {
	// TODO: logout
}
