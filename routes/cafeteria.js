/**
 * cafeteria.js
 *
 * This router takes requests on cafeterias, corners, and menus.
 * It describes the domain logic of how to act to the request.
 *
 * On error case, user will receive an error code.
 *
 * @module cafeteria
 */

const repo = require('../data/cafeteria-repository.js');

/**
 * Handle incomming GET requests to url /cafeteria/(optional)id.
 */
function handleCafeteriaRequest(req, res) {
	// Get params.
	const id = req.params.id;

	// Define a callback here.
	const onCafeteriaCallback = function(err, cafeterias) {
		// Verify data.
		if (err) {
			console.log(err);
			res.sendStatus(500);
			return;
		}
		if (!cafeterias) {
			// Something went wrong.
			res.sendStatus(500);
			return;
		}

		if (id) {
			const found = cafeterias.find(cafe =>
				cafe.id == id
			);

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

	// Fire!
	repo.getCafeterias(onCafeteriaCallback);
}

/**
 * Handle incomming GET requests to
 * url /corners/(optional)id(optional)?cafeteriaId=cafeteriaId.
 */
function handleCornerRequest(req, res) {
	// Get params.
	const id = req.params.id;
	const cafeteriaId = req.query.cafeteriaId;

	// Define a callback here.
	const onCornerCallback = function(err, corners) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
			return;
		}
		if (!corners) {
			// Something got wrong.
			res.sendStatus(500);
			return;
		}

		if (id || cafeteriaId) {
			// id of cafeteriaId is specified.
			// We need to focus on the difference of the number of the results.
			// If an id is specified, the result must be a single json.
			// If cafeteriaId, an additional query parameter, is given, the results
			// wolud be many, because it is not an id, so duplication is allowed.
			//
			// To reduce if-else statement, we get filtered as an array type, and
			// check if an id option is given.
			// If so, the filtered result would be single or undefined.

			const filtered = corners.filter(corner =>
				(!id || corner.id == id) && /* true if not specified */
				(!cafeteriaId || corner.cafeteriaId == cafeteriaId)
			);

			// Even if filtered is undefined,
			// the statement below won't make problem.
			const found = id ? filtered[0] : filtered;

			if (found) {
				res.json(found);
			} else {
				res.sendStatus(400);
			}
		} else {
			res.json(corners);
		}
	}

	// Fire!
	repo.getCorners(onCornerCallback);
}

/**
 * Handle incomming GET requests to
 * url /menu(optional)?cornerId=cornerId(optional)&date=date.
 */
function handleMenuRequest(req, res) {
	// Get params.
	const cornerId = req.query.cornerId;
	const _today = new Date().toISOString().split('T')[0].replace(/-/g, "");
	const date = req.query.date ? req.query.date : _today;

	// Define a callback here.
	const onMenuCallback = function(err, menus) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
			return;
		}
		if (!menus) {
			// Something went wrong.
			res.sendStatus(500);
			return;
		}

		if (cornerId) {
			const found = menus.filter(menu =>
				menu.cornerId == cornerId
			);

			if (found) {
				res.json(found);
			} else {
				res.sendStatus(500);
			}
		} else {
			res.json(menus);
		}
	};

	// Fire!
	repo.getMenus(date, onMenuCallback);
}

module.exports = {
	handleCafeteriaRequest,
	handleCornerRequest,
	handleMenuRequest
};
