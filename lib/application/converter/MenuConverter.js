'use strict';

module.exports = class {

	constructor(converter) {
		this.converter = converter;
	}

	convert(rawObject) {
		return this.converter.convert(rawObject);
	}

};
