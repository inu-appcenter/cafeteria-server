'use strict';

module.exports = class {

	serializeSingle(corner) {
		return {
			'cafeteria-id': corner.cafeteriaId,
			'id': corner.id,
			'name': corner.name
		}
	}
	
};
