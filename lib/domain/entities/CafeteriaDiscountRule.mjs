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
'use strict';

export default class {
  constructor({token, availableMealTypes, cafeteriaId=null}) {
    /* no primary key needed in domain */

    /**
     * For a discount request, the requested token must math this one.
     */
    this.token = token;

    /**
     * When is the discount available? (breakfast: 1,  lunch: 2, dinner: 4)
     * breakfast only -> 1 (2^0)
     * lunch only -> 2 (2^1)
     * dinner only -> 4 (2^2)
     * lunch and dinner -> 6 (2^1 + 2^2)
     * It is like unix file permission.
     */
    this.availableMealTypes = availableAt;

    this.cafeteriaId = cafeteriaId; /* foreign key */
  }

  toString() {
    return JSON.stringify(this);
  }
}
