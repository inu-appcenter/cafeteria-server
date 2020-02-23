/**
 * user-repository.js
 * @module user-repository
 */

/**
 * A callback used in this repository.
 * @callback Callback
 * @param	{Object} content content we want to pass..
 */

const SUCCESS = 200;
const WRONG_PARAM = 400;
const NO_TOKEN = 401;
const DB_ERROR = 402;
const ERROR = 403;

const crypto = require(__base + 'common/crypto.js');

const request = require('request');
const rtoken = require('rand-token');
const sqld = require('mysql');
const pool = sqld.createPool(__config.sqlConfig);

function isFunction(func) {
	return typeof func === 'function';
}

function onConnection(onSuccess, onFail) {
	const onGotConnection = function(err, connection) {
		if (err) {
			if (isFunction(onFail)) {
				onFail(err);
			}
		} else {
			if (isFunction(onSuccess)) {
				onSuccess(connection);
			}
		}
	}

	pool.getConnection(onGotConnection);
}

function query(queryString, params, onSuccess, onFail) {
	const onConnectionSuccess = function(connection) {
		const onQuery = function(err, rows, fields) {
			if (err) {
				console.log("Query fail!");
				if (isFunction(onFail)) {
					onFail(err);
				}
			} else {
				if (isFunction(onSuccess)) {
					onSuccess(connection, rows);
				}
			}
		}

		connection.query(queryString, params, onQuery);
	};

	const onConnectionFail = function(err) {
		console.log("Connection fail!");
		if (isFunction(onFail)) {
			onFail(err);
		}
	};

	onConnection(onConnectionSuccess, onConnectionFail);
}

/**
 * Login using token or student number and password.
 * Calls onSuccess with login token if succeeded.
 * Calls onFail with err if failed.
 */
function login(token, stdno, passwd, onSuccess, onFail) {
	console.log("Login!");

	if (token) {
		console.log("With token!");
		return loginWithToken(token, onSuccess, onFail);
	} else {
		console.log("Without token!");
		return loginWithoutToken(stdno, passwd, onSuccess, onFail);
	}
}


function openConnection() {
	return new Promise(function(resolve, reject) {
		pool.getConnection(function(err, connection) {
			if (err) {
				console.log(err);
				console.log("Could not get connection!");
				reject(DB_ERROR);
			} else {
				resolve(connection);
			}
		})
	});
}

function checkToken([connection, token]) {
	return new Promise(function(resolve, reject) {
		console.log("Check token!");

		const q = "SELECT stdno, token FROM autologin WHERE token = ?";
		const p = [token];
		connection.query(q, p, function(err, rows, fields) {
				if (err) {
					console.log(err);
					console.log("Query failed!");
					reject(DB_ERROR);
				} else {
					if (rows.length == 0) {
						console.log("No rows!");
						connection.release();
						reject(NO_TOKEN);
						return;
					}
					if (rows.length > 1) {
						console.log("Over 1 rows!");
						connection.release();
						reject(WTF);
						return;
					}
					resolve([connection, rows[0]]);
				}
		});
	});
}

function updateLoginTime([connection, row]) {
	return new Promise(function(resolve, reject) {
		console.log("Update login time!");

		const q = "UPDATE autologin SET updated = CURRENT_TIMESTAMP WHERE stdno = ?";
		const p = [row.stdno];

		connection.query(q, p, function(err, rows, fields) {
			if (err) {
				console.log(err);
				reject(DB_ERROR);
			} else {
				connection.release();
				resolve([row.stdno, row.token]);
			}
		});
	});
}

function loginWithToken(token, onSuccess, onFail) {
	if (!token) {
		onFail(WRONG_PARAM);
		console.log("Token invalid!");
		return false;
	}

	openConnection()
	.then((connection) => checkToken([connection, token]))
	.then(updateLoginTime)
	.then(onSuccess)
	.catch(onFail);

	return true;
}



function sendLoginRequest(stdno, passwd) {
	return new Promise(function(resolve, reject) {
		console.log("Send login request!");

		const options = {
			method: 'POST',
			uri: __config.loginConfig.url,
			form: {
				sno: stdno,
				pw: crypto.encrypt(passwd)
			}
		};

		request(options, function(err, response, body) {
			if (err) {
				console.log(err);
				reject(ERROR);
			} else {
				resolve([stdno, body]);
			}
		});
	});
}

function handleLoginResult([stdno, result]) {
	return new Promise(function(resolve, reject) {
		console.log("Handle login result!");

		if (result === 'Y') {
			console.log("Y!");
			resolve([stdno, null, null]);
		} else if (result === 'N'){
			console.log("N!");
			reject(WRONG_PARAM);
		} else {
			console.log("Fail!");
			reject(ERROR);
		}
	});
}

function createToken([stdno, prevResolve, prevReject]) {
	return new Promise(function(resolve, reject) {
		console.log("Create token!");

		const token = rtoken.generate(20);

		openConnection()
		.then((connection) => checkDuplicatedToken([connection, token]))
		.then(function(connection) {
			if (prevResolve) {
				reject(); /* Finish recursion. */
				prevResolve([connection, stdno, token]); /* Go to next step. */
			} else {
				resolve([connection, stdno, token]); /* Go to next step. */
			}
		})
		.catch(function(err) {
			if (err == 999) {
				console.log("Duplicated id!");
				createToken([
					stdno,
					prevResolve ? prevResolve : resolve,
					prevReject ? prevReject : reject
				]).catch(()=>{});
			} else {
				if (prevReject) {
					prevReject(err);
				} else {
					reject(err);
				}
			}
		});
	});
}

function checkDuplicatedToken([connection, token]) {
	return new Promise(function(resolve, reject) {
		console.log("Check duplication!");

		const q = "SELECT COUNT(token) AS cnt FROM autologin WHERE token = ?";
		const p = [token];

		connection.query(q, p, function(err, rows, fields) {
			if (err) {
				console.log(err);
				reject(DB_ERROR);
			} else {
				if (rows[0].cnt == 0) {
					resolve(connection);
				} else {
					reject(999);
				}
			}
		});
	});
}

function insertToken([connection, stdno, token]) {
	return new Promise(function(resolve, reject) {
		console.log("Insert token!");

		const q = "insert into autologin values (?, ?, CURRENT_TIMESTAMP) on duplicate key update token = ?, updated = CURRENT_TIMESTAMP";
		const p = [stdno, token, token];

		connection.query(q, p, function(err, rows, fields) {
			if (err) {
				reject(DB_ERROR);
			} else {
				resolve([stdno, token]);
			}
		});
	});
}

function loginWithoutToken(stdno, passwd, onSuccess, onFail) {
	if (!stdno) {
		onFail(WRONG_PARAM);
		console.log("Student number invalid!");
		return false;
	}
	if (!passwd) {
		onFail(WRONG_PARAM);
		console.log("Password invalid!");
		return false;
	}

	sendLoginRequest(stdno, passwd)
	.then(handleLoginResult)
	.then(createToken)
	.then(insertToken)
	.then(onSuccess)
	.catch(onFail);

	return true;
}


function getBarcode() {

}

module.exports = {
	login
};
