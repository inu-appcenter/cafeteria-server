/**
 * user.js
 *
 * Handle requests about user, such as login/out, barcode, etc...
 *
 * @module user
 */

const repo = require(__base + 'data/user-repository.js');

function handleLoginRequest(req, res) {
	const token = req.body.token;
	const stdno = req.body.stdno;
	const passwd = req.body.passwd;

	const onSuccess = function([stdno, token]) {
		console.log("Login succeeded!");
		res.json({stdno: stdno, token: token});
	}

	const onFail = function(errCode) {
		console.log("Login failed!");
		console.log(errCode);
		res.sendStatus(errCode);
	}

	repo.login(token, stdno, passwd, onSuccess, onFail);
}

function handleLogoutRequest(req, res) {

}

function handleGetBarcodeRequest(req, res) {

}

module.exports = {
	handleLoginRequest,
	handleLogoutRequest,
	handleGetBarcodeRequest
};
