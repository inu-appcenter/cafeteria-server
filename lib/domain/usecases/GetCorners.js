'use strict';

module.exports = (options, { cafeteriaRepository }) => {

	if (options.id && options.cafeteriaId) {
		// This is not allowed.
		return null;
	}

	if (options.id) {
		return cafeteriaRepository.getCornerById(options.id);
	} else if (options.cafeteriaId) {
		return cafeteriaRepository.getCornersByCafeteriaId(options.cafeteriaId);
	} else {
		return cafeteriaRepository.getAllCorners();
	}

};
