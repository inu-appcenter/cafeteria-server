'use strict';

module.exports = (options, { cafeteriaRepository }) => {

	if (options.cornerId) {
		return cafeteriaRepository.getMenusByCornerId(cornerId, options.date);
	} else {
		return cafeteriaRepository.getAllMenus(options.date);
	}

};
