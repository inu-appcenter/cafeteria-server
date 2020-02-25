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

		// menu convertion
		this.menuConverter = menuConverter;
		this.menuCache = {
			menus: {},
			updated: 0 /* millis */
		};
	}

	async getCafeterias({ id }) {
		if (id) {
			// id specified.
			// Find and return it.
			const seqCafeteria = await this.cafeteriaModel.findByPk(id);
			return new Cafeteria(seqCafeteria.id, seqCafeteria.name, seqCafeteria.image_path);
		} else {
			// id not specified.
			// Find all and return it.
			const seqCafeterias = await this.cafeteriaModel.findAll();
			return seqCafeterias.map((seqCafeteria) => {
				return new Cafeteria(seqCafeteria.id, seqCafeteria.name, seqCafeteria.image_path);
			});
		}
	}

	async getCorners({ id, cafeteriaId }) {
		if (id && cafeteriaId) {
			const seqCorner = await this.cornerModel.findOne({
				where: { id: id, cafeteria_id: cafeteriaId }
			});
			if (!seqCorner) {
				return null;
			}
			return new Corner(seqCorner.cafeteria_id, seqCorner.id, seqCorner.name);
		} else if (cafeteriaId) {
			const seqCorners = await this.cornerModel.findAll({
				where: { cafeteria_id: cafeteriaId }
			});
			return seqCorners.map((seqCorner) => {
				return new Corner(seqCorner.cafeteria_id, seqCorner.id, seqCorner.name);
			});
		} else if (id) {
			const seqCorner = await this.cornerModel.findByPk(id);
			return new Corner(seqCorner.cafeteria_id, seqCorner.id, seqCorner.name);
		} else {
			const seqCorners = await this.cornerModel.findAll();
			return seqCorners.map((seqCorner) => {
				return new Corner(seqCorner.cafeteria_id, seqCorner.id, seqCorner.name);
			});
		}
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
		}
	}

	async getMenus({ date, cornerId }) {
		await this._fetchMenusIfNeeded(date || new Date().toISOString().split('T')[0].replace(/-/g, ""));
		const allMenus = this.menuCache.menus[date];

		if (!allMenus) {
			console.log("No menu!");
			return null;
		}

		if (cornerId) {
			return allMenus.filter((menu) => menu.cornerId === cornerId);
		} else {
			return allMenus;
		}
	}

};
