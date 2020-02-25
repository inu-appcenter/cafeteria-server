'use strict';

module.exports = class {

	constructor(serializer) {
		this.serializer = serializer;
	}

	serializeSingle(data) {
		return this.serializer.serializeSingle();
	}

	serialize(data) {
		if (!data) {
			throw new Error("Expect data to be not undefined nor null");
		}

		if (Array.isArray(data)) {
			return data.map(this.serializeSingle);
		}

		return this.serializeSingle(data);
	}
}
