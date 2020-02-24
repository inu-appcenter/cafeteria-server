'use strict';

const sequelize = require(__lib + 'infrastructure/database/sequelize');
const fetch = require(__lib + 'infrastructure/network/fetch');

const Cafeteria = require(__lib + 'domain/entities/Cafeteria');
const Corner = require(__lib + 'domain/entities/Corner');
const Menu = require(__lib + 'domain/entities/Menu');

module.exports = class {

	constructor(menuConverter) {
		this.db = sequelize;
		this.cafeteriaModel = this.db.model('cafeteria');
		this.cornerModel = this.db.model('corner');
		this.convertKeyModel = this.db.model('corner-menu-key');
		this.menuConverter = menuConverter;
		this.menuCache = {
			menus: {},
			updated: 0 /* millis */
		};
	},

	async getCafeteria(id) {
		const seqCafeteria = await this.cafeteriaModel.findByPk(id);
		return new Cafeteria(seqCafeteria.id, seqCafeteria.name, seqCafeteria.imagePath);
	},

	async getAllCafeterias() {
		const seqCafeterias = await this.cafeteriaModel.findAll();
		return seqCafeterias.map((seqCafeteria) => {
			return new Cafeteria(seqCafeteria.id, seqCafeteria.name, seqCafeteria.imagePath);
		});
	},

	async getCorner(id) {
		const seqCorner = await this.cornerModel.findByPk(id);
		return new Corner(seqCorner.id, seqCorner.name, seqCorner.imagePath);
	},

	async getAllCorners() {
		const seqCorners = await this.cornerModel.findAll();
		return seqCorners.map((seqCorner) => {
			return new Cafeteria(seqCorner.id, seqCorner.name, seqCorner.imagePath);
		});
	},

	async _getConvertKeys() {
		return await this.convertKeyModel.findAll();
	},

	async _fetchMenusIfNeeded(date) {
		if (!/([12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))/.test(date)) {
			throw new Error("Bad date format");
		}

		const nowMillis = Date.now();
		const fetchInverval = __config.menuFetchConfig.intervalMillis;

		const cacheOld = nowMillis - this.menuCache.updated > fetchInverval;
		const noData = !this.menuCache.data[date];

		if (cacheOld || noData) {
			const json = await fetch.getJson(__config.menuFetchConfig.url, { date: date });
			const converted = this.menuConverter.convert(json, this._getConvertKeys());
			this.menuCache.data[date] = converted;
			this.menuCache.updated = Date.now();
		}
	},

	async getMenus(cornerId, date) {
		return this.getAllMenus(date).filter((menu) => menu.cornerId === cornerId);
	},

	async getAllMenus(date) {
		await this._fetchMenusIfNeeded(date);
		const allMenus = this.menuCache.date[date];

		if (allMenus) {
			return allMenus;
		} else {
			throw new Error("No menu after parse");
		}
	}

};
