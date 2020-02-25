'use strict';

module.exports = (id, { cafeteriaRepository }) => {
	if (id) {
		return cafeteriaRepository.getCafeteria(id);
	} else {
		return cafeteriaRepository.getAllCafeterias();
	}
};
