/**
 * cafeteria-repository.js
 *
 * Single source of truth for the list of cafeteria.
 *
 * Exports: two functions.
 */

const request = require('request');
const profiles = require(__base + 'data/cafeteria-profiles.js');
const parser = require(__base + 'data/cafeteria-parser.js');

/**
 * Configs
 */
const fetchInvervalMillis = 3600000 /* An hour */
const foodMenuUrl = 'https://sc.inu.ac.kr/inumportal/main/info/life/foodmenuSearch'

const menuCache = {
	data: {},
	lastUpdateMillis: 0
};

const checker = {
	assertNonEmptyArrayWithKeys: function(array, arrayName, keys) {
		if (!Array.isArray(array)) {
			console.log(arrayName + " is not an array!");
			return false;
		}
		if (array.length == 0) {
			console.log(arrayName + " is empty!");
			return false;
		}

		const hasKeys = function(element, keys) {
			for (var key of keys) {
 				if (typeof element[key] === "undefined") {
					return false;
				}
			}
 			return true;
		}

		if (!array.reduce((acc, cur) => acc && hasKeys(cur, keys))) {
			console.log(arrayName + " contains invalid data!");
  			return false;
		}

		return true;
	}
}

function fetchMenus(date, callback) {
	const options = {
	  'uri': foodMenuUrl,
	  'qs': { 'stdDate': date }
	};

	console.log("Fetch food menus.");

	const onResponse = function(err, response, body) {
		if (err) {
			callback(err, menuCache.data[date]);
			console.log(err);
		} else {
			const json = JSON.parse(body);
			menuCache.data[date] = parser.parse(json);
			menuCache.lastUpdateMillis = Date.now();

			callback(null, menuCache.data[date]);
		}
	};

	request(options, onResponse);
}

function getCafeterias(callback/* (err, corners) => void */) {
	// Check params.
	if (typeof callback !== "function") {
		console.log("Wrong callback!");
		return false;
	}

	// In the deep-dark JS word,
	// unexpected things always happen.
	const callbackWrapper = function(err, cafeterias) {
		if (!checker.assertNonEmptyArrayWithKeys(cafeterias, "cafeterias", profiles.getCafeteriaKeys())) {
			callback(err, null);
			return;
		}

		callback(err, cafeterias);
	}

	// No need for any additional jobs.
	const result = profiles.getCafeteriaProfiles();

	callbackWrapper(null, result);

	return true;
}

function getCorners(callback/* (err, corners) => void */) {
	// Check params.
	if (typeof callback !== "function") {
		console.log("Wrong callback!");
		return false;
	}

	// In the deep-dark JS word,
	// unexpected things always happen.
	const callbackWrapper = function(err, corners) {
		if (!checker.assertNonEmptyArrayWithKeys(corners, "corners", profiles.getCornerKeys())) {
			callback(err, null);
			return;
		}

		callback(err, corners);
	}

	// Remove unnecessary fields.
	const result = profiles.getCornerProfiles().map(profile =>
		({
			'cafeteriaId': profile.cafeteriaId,
			'id': profile.id,
			'name': profile.name
		})
	);

	callbackWrapper(null, result);

	return true;
}

function getMenus(date, callback/* (err, menus) => void */) {
	// Check parameters.
	if (!/([12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))/.test(date)) {
		console.log("Wrong date format!");
		return false;
	}
	if (typeof callback !== "function") {
		console.log("Wrong callback!");
		return false;
	}

	// In the deep-dark JS word,
	// unexpected things always happen.
	const callbackWrapper = function(err, menus) {
		if (!checker.assertNonEmptyArrayWithKeys(menus, "menus", profiles.getMenuKeys())) {
			callback(err, null);
			return;
		}

		callback(err, menus);
	}

	// Do actual things here.
	const cacheOld = Date.now() - menuCache.lastUpdateMillis > fetchInvervalMillis;
	const noData = menuCache.data[date] == null;

	if (cacheOld || noData) {
		// Do fetch if needed.
		fetchMenus(date, callbackWrapper);
	} else {
		// Or just launch the callback.
		callbackWrapper(null, menuCache.data[date]);
	}

	return true;
}

module.exports = {
	fetchMenus,
	getCafeterias,
	getCorners,
	getMenus
};
