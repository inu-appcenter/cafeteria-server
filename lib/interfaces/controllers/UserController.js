/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Appcenter <potados99@gmail.com>
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

const Boom = require('@hapi/boom');

/**
 * Serializer
 */
const BaseSerializer = require('@domain/serializer/BaseSerializer');
const UserSerializer = require('@interfaces/serializers/UserSerializer');

/**
 * Transformer
 */
const BarcodeTransformer = require('@domain/security/BarcodeTransformer');
const BarcodeTransformerImpl = require('@interfaces/security/BarcodeTransformerImpl');

/**
 * Use Cases
 */
const Login = require('@domain/usecases/Login');
const Logout = require('@domain/usecases/Logout');
const GetUser = require('@domain/usecases/GetUser');

/**
 * Repository
 */
const UserRepository = require('@domain/repositories/UserRepository');
const UserRepositoryImpl = require('@interfaces/storage/UserRepositoryImpl');

/**
 * Instances
 */
const userRepository = new UserRepository(new UserRepositoryImpl());
const userSerializer = new BaseSerializer(new UserSerializer());
const barcodeTransformer = new BarcodeTransformer(new BarcodeTransformerImpl());

module.exports = {

	async login(request, h) {

		const { token, id, password } = request.payload;
		const auth = request.cookieAuth;

		const result = await Login(
			{ token: token, id: id, password: password },
			{ userRepository, auth }
		);

		if (result === UserRepository.LOGIN_OK) {
			const user = await GetUser({ token: token, id: id }, { userRepository, barcodeTransformer });

			// Set session here!
			request.cookieAuth.set(user);

			return userSerializer.serialize(user);
		} else {
			switch (result) {
				case UserRepository.LOGIN_WRONG_ID_PW:
					return Boom.unauthorized('Invalid password');
				case UserRepository.LOGIN_INVALID_TOKEN:
					return Boom.unauthorized('Invalid token');
				case UserRepository.LOGIN_NOT_SUPPORTED:
					return Boom.forbidden('Not supported');
				default:
					return Boom.badImplementation();
			}
		}
	},

	async logout(request, h) {

		if (!request.auth.isAuthenticated) {
			// Only users with authentification can perform logout.
			return Boom.unauthorized('Missing authentication; Auth filtering before handler is disabled');
		}

		// Grep id before breaking the session.
		const id = request.auth.credentials.id;

		// Break session whatever.
		request.cookieAuth.clear();

		const result = await Logout({ id: id }, { userRepository });

		if (result === UserRepository.LOGOUT_OK) {
			return h.response().code(200);
		} else {
			switch (result) {
				case UserRepository.LOGOUT_NO_USER:
					return Boom.badImplementation('Cannot find user.');
				default:
					return Boom.badImplementation();
			}
		}
	},
};
