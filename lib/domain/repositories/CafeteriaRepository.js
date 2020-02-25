'use strict';

module.exports = class {

	constructor(repo) {
		this.repo = repo;
	}

	getCafeterias(options={}) {
		return this.repo.getCafeterias(options);
	}

	getCorners(options={}) {
		return this.repo.getCorners(options);
	}

	getMenus(options={}) {
		return this.repo.getMenus(options);
	}
};
