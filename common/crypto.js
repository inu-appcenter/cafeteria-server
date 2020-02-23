const crypto = require('crypto');

function encrypt(raw) {
	const cipher = crypto.createCipher('aes-256-cbc', __config.cryptoConfig.password);
	cipher.update(raw, 'utf-8', 'base64');
	return cipher.final('base64');
}

module.exports = {
	encrypt
};
