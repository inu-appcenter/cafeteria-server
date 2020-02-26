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

const UserRepository = require('@domain/repositories/UserRepository');

module.exports = async (options/* no use */, { userRepository, request }) => {

	if (request.auth.isAuthenticated) {
		const result = await userRepository.tryLogout(request.auth.credentials.id);

		request.cookieAuth.clear();

		return result;
	} else {
		// It is impossible to reach here because unauthentificated requests
		// will be all blocked by auth setting of this server.
		return UserRepository.LOGOUT_NO_AUTH;
	}

};
