/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020  INU Appcenter <potados99@gmail.com>
 *
 * INU Cafeteria is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * INU Cafeteria is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
'use strict';

module.exports = class {

	static LOGIN_OK = 0;
	static LOGIN_WRONG_ID_PW = 1;
	static LOGIN_INVALID_TOKEN = 2;
	static LOGIN_NOT_SUPPORTED = 3;

	static LOGOUT_OK = 4;
	static LOGOUT_NO_USER = 5
	static LOGOUT_NO_AUTH = 6;

	constructor(repo) {
		this.repo = repo;
	}

	tryLoginWithToken(token) {
		return this.repo.tryLoginWithToken(token);
	}

	tryLoginWithIdAndPassword(id, password) {
		return this.repo.tryLoginWithIdAndPassword(id, password);
	}

	tryLogout(id) {
		return this.repo.tryLogout(id);
	}

	setBarcode(id, barcode) {
		return this.repo.setBarcode(id, barcode);
	}

	getUserById(id) {
		return this.repo.getUserById(id);
	}

	getUserByToken(token) {
		return this.repo.getUserByToken(token);
	}

};
