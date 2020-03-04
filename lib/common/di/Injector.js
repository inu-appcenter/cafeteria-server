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

class Injector {
  static instancesMap = new Map();

  /**
   * Initialize an injector with given instances.
   * @param {Map} instancesMap map of instances. key: Class, value: instance.
   */
  static init(instancesMap) {
    if (!instancesMap) {
      throw new Error('Cannot init Injector: instancesMap must be valid');
    }

    Injector.instancesMap = instancesMap;
  }

  /**
   * Resolve an instance of a class.
   * @param {Function} classType type of a class
   * @return {any} instance of that class.
   */
  static resolve(classType) {
    if (!classType) {
      throw new Error('Cannot init Injector: instancesMap must be valid');
    }

    const instance = this.instancesMap.get(classType);
    if (!instance) {
      throw new Error(`No instance of ${classType}`);
    }

    return instance;
  }
}

export default Injector;


