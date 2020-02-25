/**
 * cafeteria-repository.js
 *
 * Single source of truth for the list of cafeteria.
 * Functions in this repository will give us null as data when an error occured.
 * Therefore the null can be considered as a sign that there was a failure while
 * getting the data.
 *
 * @module cafeteria-repository
 */

 /**
  * A callback used in this repository.
  * @callback DataCallback
  * @param	{Object} err an error object. null or undefined if no error.
  * @param	{Object} data data if successful.
  */

 /**
  * A cache object.
  * @typedef	{Object} Cache
  */

const request = require('request');
const profiles = require(__base + 'data/cafeteria-profiles.js');
const parser = require(__base + 'data/cafeteria-parser.js');

/**
 * Minumum fetch interval.
 * @const {number}
 */
const fetchInvervalMillis = 3600000 /* An hour */

/**
 * Data source.
 * @const {string}
 */
const foodMenuUrl = 'https://sc.inu.ac.kr/inumportal/main/info/life/foodmenuSearch'

/**
 * A simple cache object that holds fetched menu data.
 * @const {Cache}
 */
const menuCache = {
	data: {},
	lastUpdateMillis: 0
};

/**
 * A checker function that asserts the given first parameter is an array
 * with size > 0 and every element in that has all keys specified in
 * second parameter.
 *
 * @param	{array} array (could be or not)an array.
 * @param	{string} arrayName name of the array. used to write a log.
 * @param	{array} keys array of key strings.
 * @returns	{boolean} true if assertion succeded, otherwise false.
 */
function assertNonEmptyArrayWithKeys(array, arrayName, keys, shoudNotBeEmpty=true) {
	if (!array) {
		console.log(arrayName + " is null or undefined!");
		return false;
	}
	if (!Array.isArray(array)) {
		console.log(arrayName + " is not an array!");
		return false;
	}
	if (shoudNotBeEmpty && array.length == 0) {
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

	if (array.length != 0 && !array.reduce((acc, cur) => acc && hasKeys(cur, keys))) {
		console.log(arrayName + " contains invalid data!");
		return false;
	}

	return true;
}

/**
 * Fetch menus from source and save the to the cache.
 *
 * @param	{string} date a date string in yyyymmdd format.
 * @param	{DataCallback} callback a callback.
 */
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

/**
 * Get all cafeteria.
 * If succeeded, the result of this call pulfils key requisition of
 * 'cafeteria-keys.js' and is in a good form that can be sent to user.
 *
 * In current implementation it does not require any async tasks nor callbacks,
 * but for the consistency every public function in this repository is forced
 * to use callback.
 *
 * Before calling the real callback, because there could be some cases we did
 * not expect, to handle the case, the callback is wrapped in a callback wrapper
 * with some data checks.
 *
 * @param	{DataCallback} callback callback
 * @return	{boolean} true if call succeeded, otherwise false.
 */
function getCafeteria(callback/* (err, corners) => void */) {
	// Check params.
	if (typeof callback !== "function") {
		console.log("Wrong callback!");
		return false;
	}

	// In the deep-dark JS world,
	// unexpected things always happen.
	const callbackWrapper = function(err, cafeteria) {
		if (!assertNonEmptyArrayWithKeys(cafeteria, "cafeteria", profiles.getCafeteriaKeys())) {
			callback(err, null);
			return;
		}

		callback(err, cafeteria);
	}

	// No need for any additional jobs.
	const result = profiles.getCafeteriaProfiles();

	callbackWrapper(null, result);

	return true;
}

/**
 * Get all corners.
 * If succeeded, the result of this call pulfils key requisition of
 * 'corners-keys.js' and is in a good form that can be sent to user.
 *
 * In current implementation it does not require any async tasks nor callbacks,
 * but for the consistency every public function in this repository is forced
 * to use callback.
 *
 * Before calling the real callback, because there could be some cases we did
 * not expect, to handle the case, the callback is wrapped in a callback wrapper
 * with some data checks.
 *
 * @param	{DataCallback} callback callback
 * @return	{boolean} true if call succeeded, otherwise false.
 */
function getCorners(callback/* (err, corners) => void */) {
	// Check params.
	if (typeof callback !== "function") {
		console.log("Wrong callback!");
		return false;
	}

	// In the deep-dark JS world,
	// unexpected things always happen.
	const callbackWrapper = function(err, corners) {
		if (!assertNonEmptyArrayWithKeys(corners, "corners", profiles.getCornerKeys())) {
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

/**
 * Get all menus.
 * If succeeded, the result of this call pulfils key requisition of
 * 'menu-keys.js' and is in a good form that can be sent to user.
 *
 * In current implementation it does not require any async tasks nor callbacks,
 * but for the consistency every public function in this repository is forced
 * to use callback.
 *
 * Before calling the real callback, because there could be some cases we did
 * not expect, to handle the case, the callback is wrapped in a callback wrapper
 * with some data checks.
 *
 * @param	{string} date a date string in yyyymmdd format.
 * @param	{DataCallback} callback callback
 * @return	{boolean} true if call succeeded, otherwise false.
 */
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

	// In the deep-dark JS world,
	// unexpected things always happen.
	const callbackWrapper = function(err, menus) {
		// It could be empty.
		if (!assertNonEmptyArrayWithKeys(menus, "menus", profiles.getMenuKeys(), shoudNotBeEmpty=false)) {
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
	getCafeteria,
	getCorners,
	getMenus
};
