'use strict';

module.exports = class {

	serializeSingle(menu) {
		return {
			'corner-id': menu.cornerId,
			'foods': menu.foods,
			'price': menu.price,
			'calorie': menu.calorie
		}
	}

};
