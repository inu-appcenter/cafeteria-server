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

jest.unmock('@config/config');

jest.mock('@config/config', () => {
	return {
		sequelize: {
			database: 'cafeteria', /* cafeteria */
			username: 'hah',
			password: 'duh',
			host: 'host', /* localhost */
			dialect: 'mysql', /* mysql */
			logging: false
		},

		log: {
			timestamp: 0,
			file: {
				name: (name) => 'logs/' + name + '/' + name + '-test-%DATE%.log',
				datePattern: ''
			}
		}
	};
});

const Login = require('@domain/usecases/Login');
const Logout = require('@domain/usecases/Logout');
const GetUser = require('@domain/usecases/GetUser');
const GenerateBarcode = require('@domain/usecases/GenerateBarcode');

const UserRepository = require('@domain/repositories/UserRepository');
const UserController = require('@interfaces/controllers/UserController');

jest.mock('@domain/usecases/Login');
jest.mock('@domain/usecases/Logout');
jest.mock('@domain/usecases/GetUser');
jest.mock('@domain/usecases/GenerateBarcode');

const CookieAuth = class {
	constructor() {
		this.data = null;
	}

	set(data) {
		this.data = data;
	}

	get() {
		return this.data;
	}

	clear() {
		this.data = null;
	}
}

describe('# User controller', () => {

	it('should login', async () => {

		Login.mockImplementationOnce(() => {
			return UserRepository.LOGIN_OK;
		});

		const user = {
			id: '201701562',
			token: 'token',
			barcode: 'barcode'
		};

		GetUser.mockImplementationOnce(() => {
			return user;
		});

		GenerateBarcode.mockImplementationOnce(() => {});

		const request = {
			payload: {
				id: '201701562',
				password: 'blah'
			},
			cookieAuth: new CookieAuth()
		};

		await UserController.login(request);

		expect(request.cookieAuth.get()).toEqual(user);

	});

	it('should logout', async () => {

		Login.mockImplementationOnce(() => {
			return UserRepository.LOGOUT_OK;
		});

		const user = {
			id: '201701562',
			token: 'token',
			barcode: 'barcode'
		};

		const auth = {
			isAuthenticated: true,
			credentials: user
		};

		const cookieAuth = new CookieAuth();
		cookieAuth.set(user);

		const request = {
			auth: auth,
			cookieAuth: cookieAuth
		};

		const h = {
			response: () => {
				return {
					code: () => {

					}
				};
			}
		};

		expect(UserRepository.LOGIN_OK).toBe(0);

		expect(cookieAuth.get()).toEqual(user);

		await UserController.logout(request, h);

		expect(cookieAuth.get()).toBeNull();

	});

});
