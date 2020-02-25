'use strict';

const menuConfig = require('@config/menu-config');
const sequelize = require('@infrastructure/database/sequelize');
const fetch = require('@infrastructure/network/fetch');

const Cafeteria = require('@domain/entities/Cafeteria');
const Corner = require('@domain/entities/Corner');
const Menu = require('@domain/entities/Menu');

module.exports = class {

	constructor(menuConverter) {
		// db
		this.db = sequelize;

		// db models
		this.cafeteriaModel = this.db.model('cafeteria');
		this.cornerModel = this.db.model('corner');

		// menu convertion
		this.menuConverter = menuConverter;
		this.menuCache = {
			menus: {},
			updated: 0 /* millis */
		};
	}

	async getAllCafeteria() {
		const seqCafeteria = await this.cafeteriaModel.findAll();
		return seqCafeteria.map((seqCafeteria) => {
			return new Cafeteria(seqCafeteria.id, seqCafeteria.name, seqCafeteria.image_path);
		});
	}

	async getCafeteriaById(id) {
		const seqCafeteria = await this.cafeteriaModel.findByPk(id);
		return new Cafeteria(seqCafeteria.id, seqCafeteria.name, seqCafeteria.image_path);
	}

	async getAllCorners() {
		const seqCorners = await this.cornerModel.findAll();
		return seqCorners.map((seqCorner) => {
			return new Corner(seqCorner.cafeteria_id, seqCorner.id, seqCorner.name);
		});
	}

	async getCornerById(id) {
		const seqCorner = await this.cornerModel.findByPk(id);
		return new Corner(seqCorner.cafeteria_id, seqCorner.id, seqCorner.name);
	}

	async getCornersByCafeteriaId(cafeteriaId) {
		const seqCorners = await this.cornerModel.findAll({
			where: { cafeteria_id: cafeteriaId }
		});
		return seqCorners.map((seqCorner) => {
			return new Corner(seqCorner.cafeteria_id, seqCorner.id, seqCorner.name);
		});
	}

	async getAllMenus(date) {
		const allMenus = await this._getLatestMenu(date || new Date().toISOString().split('T')[0].replace(/-/g, ""));
		return allMenus;
	}

	async getMenusByCornerId(cornerId, date){
		const allMenus = await this._getLatestMenu(date || new Date().toISOString().split('T')[0].replace(/-/g, ""));
		return allMenus.filter((menu) => menu.cornerId === cornerId);
	}

	async _getLatestMenu(date) {
		if (!/([12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))/.test(date)) {
			throw new Error("Bad date format");
		}

		const nowMillis = Date.now();

		const cacheOld = nowMillis - this.menuCache.updated > menuConfig.fetchInverval;
		const noData = this.menuCache.menus[date] == null;

		if (cacheOld || noData) {
			try {
				const json = await fetch.getJson(menuConfig.url, { stdDate: date });
				const converted = this.menuConverter.convert(json);
				this.menuCache.menus[date] = converted;
				this.menuCache.updated = Date.now();
			}
			catch (e) {
				console.log(e);
			}
		}

		if (!this.menuCache.menus[date]) {
			console.log("No menu after fetch!");
			return [];
		}

		return this.menuCache.menus[date];
	}

};
