'use strict';

module.exports = class {

	constructor(repo) {
		this.repo = repo;
	},

	getCafeteria(id) {
		return this.repo.getCafeteria(id);
	},

	getAllCafeterias() {
		return this.repo.getAllCafeterias();
	},

	getCorner(id) {
		return this.repo.getCorner(id);
	},

	getAllCorners() {
		return this.repo.getAllCorners();
	},

	getMenus(cornerId, date) {
		return this.repo.getMenus(cornerId, date);
	},

	getAllMenus(date) {
		return this.repo.getAllMenus(date);
	}
};
