/**
 * cafeteria-profile.js
 *
 * Hardcoded cafeteria profiles.
 * We get food menus from Smart Campus API (https://sc.inu.ac.kr/inumportal/main/info/life/foodmenuSearch),
 * which SUCKS and does not give us anything usefule for listing and naming cafeterias.
 * So we need a hardcoded solution.
 *
 * Exports: two functions that read and return JSON.
 *
 * TODO
 * It is best to lesser hard texts and place them in a configuration files.
 * We need to to them later.
 */

const fs = require('fs');

function readJson(fileName) {
	return JSON.parse(fs.readFileSync(__base + 'data/' + fileName, 'utf8'));
}

function getCafeteriaKeys() { return readJson('cafeteria-keys.js'); }
function getCafeteriaProfiles() { return readJson('cafeterias.js'); }

function getCornerKeys() { return readJson('corner-keys.js'); }
function getCornerProfiles() { return readJson('corners.js'); }

function getMenuKeys() { return readJson('menu-keys.js'); }

module.exports = {
	getCafeteriaKeys,
	getCafeteriaProfiles,

	getCornerKeys,
	getCornerProfiles,

	getMenuKeys
};
