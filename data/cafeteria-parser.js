/**
 * cafeteria-parser.js
 *
 * We do the FUCKING DIRTY menu parsing here.
 *
 * Exports: parse function.
 */

 const profile = require('./cafeteria-profiles.js');

/**
 * Parse a raw json object (not a string!) to an array of menu.
 *
 * @param raw			unrectified dirty garbage
 * @param n_cafeteria	how many cafeterias?
 * @return				array of { 'cornerId':..., 'foods':..., 'price':..., 'calorie':... }.
 */
function parse(raw) {
	// Lets see,
	// the raw object consists of these fields(keys):
	//
	// 	foodMenuType1Result
	//	foodMenuType2Result
	// 	foodMenuType3Result
	//	foodMenuType4Result
	//	foodMenuType5Result
	//	afterDay
	//	beforeDay
	//
	// I coudn't even get closed to the toughts the dev had.
	// He(She) must have been crazy :(
	// However, looking inside them, the foodMenuType(1~5)Result is an array
	// with following contents:
	//
	//	TYPE2			: 	WTF?
	//	FOODMENU_TYPE	:	WTF?
	//	STD_DATE		:	Oh ya, date!
	//	MENU			:	Food menu string, containing menus, price, and calori.
	//	TYPE1			:	WTF?
	//
	// Fuck.
	//
	// Oh if you wanna see the god damn motherfucking raw json you can just enter
	// https://sc.inu.ac.kr/inumportal/main/info/life/foodmenuSearch?stdDate=2020mmdd
	// and see the fucking result.
	//
	// Our mission is to refine them and create a pretty json objects like:
	//
	//	[
	//		{
	//			'cornerId': 1,
	//			'foods': 'blah blah whatever something',
 	//			'price': '3500',
	//			'calorie': 335
	//		},
	//		...
	//	]

	// To be returned.
	let result = [];

	// Get a lambda that makes a formated string.
	const getFieldName = n => 'foodMenuType' + n + 'Result';

	// Get number of cafeterias.
	const n_cafeteria = profile.getCafeteriaProfiles().length;

	// Total
	for(var n = 1; n <= n_cafeteria; n++) {
		const corners = raw[getFieldName(n)];


	}

}
