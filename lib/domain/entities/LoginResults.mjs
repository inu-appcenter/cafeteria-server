/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Global App Center <potados99@gmail.com>
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

export default {
  /**
   * This means an attempt to login is succeeded.
   */
  SUCCESS: 0x00,

  /**
   * Authentication is valid but cannot use this service.
   */
  NOT_SUPPORTED: 0x01,

  /**
   * Wrong id or password.
   */
  WRONG_AUTH: 0x02,

  /**
   * Token is expired or useless.
   */
  INVALID_TOKEN: 0x04,

  /**
   * User does not exist.
   */
  USER_NOT_FOUND: 0x08,
};
