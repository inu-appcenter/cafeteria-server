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

/**
 * Outgoing notification to user.
 */
export default class {
  constructor({id=null, title, body, userId=null, feedbackId=null}) {
    this.id = id; /* primary key */

    this.title = title;
    this.body = body;

    this.userId = userId; /* foreign key */
    this.feedbackId = feedbackId; /* foreign key */
  }

  toString() {
    return JSON.stringify(this);
  }
}