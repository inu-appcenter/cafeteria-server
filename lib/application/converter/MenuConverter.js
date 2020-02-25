'use strict';

module.exports = class {

	constructor(converter) {
		this.converter = converter;
	}

	convert(rawObject, cornerMenuKey) {
		return this.converter.convert(rawObject, cornerMenuKey);
	}

};
