'use strict';

module.exports = class {

	serializeSingle(cafeteria) {
		return {
			'id': cafeteria.id,
			'name': cafeteria.name,
			'image-path': cafeteria.imagePath
		}
	}

};
