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

import UseCase from './UseCase';

/**
 * Do logout.
 * In session based auth environment, we need nothing to do here.
 * With JWT, we need to put the logged-out token to the 'blacklist'.
 *
 * We (yet) do not need to handle some situations like logging out
 * an account deleted, blocked, suspended, password changed,
 * permissions changed, user logged out by admin. Good news :)
 */
class Logout extends UseCase {
  constructor({userRepository}) {
    super();
  }

  onExecute(param) {
    return this.userRepository.tryLogout(id);
  }
}

export default Logout;
