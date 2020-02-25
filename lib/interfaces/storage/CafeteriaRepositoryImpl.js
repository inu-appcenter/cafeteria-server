'use strict';

const sequelize = require('@infrastructure/database/sequelize');
const fetch = require('@infrastructure/network/fetch');

const Cafeteria = require('@domain/entities/Cafeteria');
const Corner = require('@domain/entities/Corner');
const Menu = require('@domain/entities/Menu');

const menuConfig = require('@config/menu-config');

module.exports = class {

	constructor(menuConverter) {
		// db
		this.db = sequelize;

		// db models
		this.cafeteriaModel = this.db.model('cafeteria');
		this.cornerModel = this.db.model('corner');
		this.convertKeyModel = this.db.model('corner-menu-key');

		// menu convertion
		this.menuConverter = menuConverter;
		this.menuCache = {
			menus: {},
			updated: 0 /* millis */
		};
	}

	async getCafeteria(id) {
		const seqCafeteria = await this.cafeteriaModel.findByPk(id);
		return new Cafeteria(seqCafeteria.id, seqCafeteria.name, seqCafeteria.imagePath);
	}

	async getAllCafeterias() {
		const seqCafeterias = await this.cafeteriaModel.findAll();
		return seqCafeterias.map((seqCafeteria) => {
			return new Cafeteria(seqCafeteria.id, seqCafeteria.name, seqCafeteria.imagePath);
		});
	}

	async getCorner(id) {
		const seqCorner = await this.cornerModel.findByPk(id);
		return new Corner(seqCorner.id, seqCorner.name, seqCorner.imagePath);
	}

	async getAllCorners() {
		const seqCorners = await this.cornerModel.findAll();
		return seqCorners.map((seqCorner) => {
			return new Cafeteria(seqCorner.id, seqCorner.name, seqCorner.imagePath);
		});
	}

	async _getConvertKeys() {
		return await this.convertKeyModel.findAll();
	}

	async _fetchMenusIfNeeded(date) {
		if (!/([12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))/.test(date)) {
			throw new Error("Bad date format");
		}

		const nowMillis = Date.now();

		const cacheOld = nowMillis - this.menuCache.updated > menuConfig.fetchInverval;
		const noData = this.menuCache.menus[date] == null;

		if (cacheOld || noData) {
			try {
				const json = await fetch.getJson(menuConfig.url, { stdDate: date });
				const converted = this.menuConverter.convert(json, this._getConvertKeys());
				this.menuCache.menus[date] = converted;
				this.menuCache.updated = Date.now();
			}
			catch (e) {
				console.log(e);
			}
		}
	}

	async getMenus(cornerId, date) {
		const menus = await this.getAllMenus(date);
		return menus.filter((menu) => menu.cornerId === cornerId);
	}

	async getAllMenus(date) {
		await this._fetchMenusIfNeeded(date);
		const allMenus = this.menuCache.menus[date];

		if (allMenus) {
			return allMenus;
		} else {
			throw new Error("No menu after parse");
		}
	}

};
