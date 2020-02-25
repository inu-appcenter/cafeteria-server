'use strict';

module.exports = (options, { cafeteriaRepository }) => {
	
	if (options.id && options.cafeteriaId) {
		return null;
	}

	if (options.id) {
		return cafeteriaRepository.getCornerById(id);
	} else if (options.cafeteriaId) {
		return cafeteriaRepository.getCornersByCafeteriaId(options.cafeteriaId);
	} else {
		return cafeteriaRepository.getAllCorners();
	}

};
