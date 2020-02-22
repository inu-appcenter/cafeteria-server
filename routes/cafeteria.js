/**
 * cafeteria.js
 *
 * This router takes requests on cafeteria and corners.
 *
 * Exports: two router functions that takes req, res as arguments.
 */

const repo = require('../data/cafeteria-repository.js');

function handleCafeteriaRequest(req, res) {
	const id = req.params.id;
	const cafeterias = repo.getCafeterias();

	if (!cafeterias) {
		res.sendStatus(400);
		return;
	}

	if (id) {
		const found = cafeterias.find(cafe => cafe.id == id);
		if (found) {
			res.json(found);
		} else {
			res.sendStatus(400);
			return;
		}
	} else {
		res.json(cafeterias);
	}
}

function handleCornerRequest(req, res) {

}

function handleMenuRequest(req, res) {

}

module.exports = {
	handleCafeteriaRequest,
	handleCornerRequest,
	handleMenuRequest
};
