'use strict';

function giveMeNum() {

	return 3;
}

module.exports = class {
	
	num() {
		return giveMeNum();
	}

};
