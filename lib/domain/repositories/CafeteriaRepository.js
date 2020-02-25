'use strict';

module.exports = class {

	constructor(repo) {
		this.repo = repo;
	}

	getAllCafeteria() {
		return this.repo.getAllCafeteria();
	}

	getCafeteriaById(id) {
		return this.repo.getCafeteriaById(id);
	}

	getAllCorners() {
		return this.repo.getAllCorners();
	}

	getCornerById(id) {
		return this.repo.getCornerById(id);
	}

	getCornersByCafeteriaId(cafeteriaId) {
		return this.repo.getCornersByCafeteriaId(cafeteriaId);
	}

	getAllMenus(date=null) {
		return this.repo.getAllMenus(date);
	}

	getMenusByCornerId(cornerId, date=null) {
		return this.repo.getMenusByCornerId(cornerId, date);
	}
};
