'use strict';

module.exports = class {

	constructor(serializer) {
		this.delegateSerialzer = serializer;
	}

	serialize(data) {
		if (!data) {
			throw new Error("Expect data to be not undefined nor null");
		}

		if (Array.isArray(data)) {
			return data.map(this.delegateSerialzer.serializeSingle);
		}

		return this.delegateSerialzer.serializeSingle(data);
	}
	
};
