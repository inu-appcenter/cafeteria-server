/**
 * cafeteria-repository.js
 *
 * Single source of truth for the list of cafeteria.
 *
 * Exports: two functions.
 */

const request = require('request');
const profiles = require('./cafeteria-profiles.js');
const parser = require('./cafeteria-parser.js');

/**
 * Configs
 */
const fetchInvervalMillis = 3600000 /* An hour */
const foodMenuUrl = 'https://sc.inu.ac.kr/inumportal/main/info/life/foodmenuSearch'

const menuCache = {
	data: null,
	lastUpdateMillis: 0
};

function fetchMenus(date, callback) {
	const options = {
	  'uri': foodMenuUrl,
	  'qs': { 'stdDate': date }
	};
	request(options, function(err, response, body) {
		if (err) {
			callback(err, menuCache.data);
			console.log(err);
		} else {
			const json = JSON.parse(body);
			menuCache.data = parser.parse(json);

			callback(null, menuCache.data);
		}
	});
}

function getCafeterias() {
	// No need for any additional jobs.
	return profiles.getCafeteriaProfiles();
}

function getCorners() {
	// Remove unnecessary fields.
	return profiles.getCornerProfiles().map( profile =>
		({
			'cafeteriaId': profile.cafeteriaId,
			'id': profile.id,
			'name': profile.name
		})
	);
}

function getMenus(date, callback) {
	const cacheOld = Date.now() - menuCache.lastUpdateMillis > fetchInvervalMillis;
	const noData = menuCache.data == null;
	if (cacheOld || noData) {
		fetchMenus(date, callback);
	} else {
		callback(null, menuCache.data);
	}
}

module.exports = {
	fetchMenus,
	getCafeterias,
	getCorners,
	getMenus
};
