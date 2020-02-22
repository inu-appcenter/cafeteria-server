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

function getCafeteriaProfiles() {
	return JSON.parse(fs.readFileSync(__dirname + '/cafeterias.js', 'utf8'));
}

function getCornerProfiles() {
	return JSON.parse(fs.readFileSync(__dirname + '/corners.js', 'utf8'));
}

module.exports = {
	getCafeteriaProfiles,
	getCornerProfiles
};
