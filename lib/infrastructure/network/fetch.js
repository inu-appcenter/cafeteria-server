'use strict';

const fetch = require('node-fetch');

function _isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function _serialize(obj) {
	var str = [];
	for (var p in obj)
	if (obj.hasOwnProperty(p)) {
		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	}
	return str.join("&");
}

function _createUrl(url, options) {
	return _isEmpty(options) ? url : (url + '?' + _serialize(options));
}

module.exports = {

	async getJson(url, options) {
		const queryUrl = _createUrl(url, options);
		const response = await fetch(queryUrl);
		const json = await response.json();
		return json;
	}

};
