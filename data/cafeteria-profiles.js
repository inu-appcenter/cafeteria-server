/**
 * cafeteria-profile.js
 *
 * Hardcoded cafeteria profiles.
 * We get food menus from Smart Campus API (https://sc.inu.ac.kr/inumportal/main/info/life/foodmenuSearch),
 * which SUCKS and does not give us anything usefule for listing and naming cafeterias.
 * So we need a hardcoded solution.
 *
 * @module cafeteria-profile
 */

/**
 * A profile that holds infomrations about a cafeteria.
 * Keys: id: number, name: string, imagePath: string,
 * supportFoodMenu: boolean, supportAlarm: boolean.
 * @typedef	{Object} CafeteriaProfile
 */

/**
 * A profile that holds informations about a corner.
 * Keys: cafeteriaId: number, id: number, name: string,
 * _type1: number, _type2: number.
 * @typedef	{Object} CornerProfile
 */

const fs = require('fs');

/**
 * Read a JSON file in the same directory and parse it.
 *
 * @param 	{string} fileName name of the file to read.
 * @returns	{Object} a parsed object.
 */
function readJson(fileName) {
	return JSON.parse(fs.readFileSync(__base + 'data/' + fileName, 'utf8'));
}

/**
 * Get array of keys that should be included in the response.
 *
 * @returns	{array} array of keys.
 */
function getCafeteriaKeys() { return readJson('cafeteria-keys.js'); }

/**
 * Get profiles of cafeteria.
 *
 * @returns	{CafeteriaProfile} the profiles.
 */
function getCafeteriaProfiles() { return readJson('cafeterias.js'); }

/**
 * Get array of keys that should be included in the response.
 *
 * @returns	{array} array of keys.
 */
function getCornerKeys() { return readJson('corner-keys.js'); }

/**
 * Get profiles of corner.
 *
 * @returns	{CornerProfile} the profiles.
 */
function getCornerProfiles() { return readJson('corners.js'); }

/**
 * Get array of keys that should be included in the response.
 *
 * @returns	{array} array of keys.
 */
function getMenuKeys() { return readJson('menu-keys.js'); }

module.exports = {
	getCafeteriaKeys,
	getCafeteriaProfiles,

	getCornerKeys,
	getCornerProfiles,

	getMenuKeys
};
