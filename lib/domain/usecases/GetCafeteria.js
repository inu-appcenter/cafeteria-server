'use strict';

module.exports = (options, { cafeteriaRepository }) => {

	if (options.id) {
		return cafeteriaRepository.getCafeteriaById(options.id);
	} else {
		return cafeteriaRepository.getAllCafeteria();
	}
	
};
