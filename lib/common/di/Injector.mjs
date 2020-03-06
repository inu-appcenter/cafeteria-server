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

class Injector {
  constructor() {
    this.verbose = true;

    this._createFunctions = new Map();
    this._instances = new Map();
  }

  /**
   * Initialize an injector with given declaration(s).
   *
   * @param {[]|{create, as}} declaration of instances.
   */
  async init(declaration) {
    if (!declaration) {
      throw new Error('Cannot init Injector: invalid declaration');
    }

    // In case of re-init, clear all collections.
    this._createFunctions.clear();
    this._instances.clear();

    const insertCreateFunction = (singleDeclaration) => {
      this._createFunctions.set(
        singleDeclaration.as,
        singleDeclaration.create,
      );
    };

    if (Array.isArray(declaration)) {
      declaration.forEach(insertCreateFunction);
    } else {
      insertCreateFunction(declaration);
    }

    await this._instantiateAll();
  }

  /**
   * Resolve an instance of a class.
   *
   * @param {Function} classType type of a class
   * @return {any} instance of that class.
   */
  resolve(classType) {
    if (!classType) {
      throw new Error('Cannot resolve: invalid type');
    }

    const instance = this._instances.get(classType);
    if (!instance) {
      throw new Error(`No instance of ${classType}`);
    }

    return instance;
  }

  async _instantiateAll() {
    for (const entry of this._createFunctions) {
      const type = entry[0]; /* key */
      const createFunc = entry[1]; /* value */

      const instancePredict = this._instances.get(type);
      if (instancePredict) {
        this._log(0, `'${type.name}' is already instantiated. Pass`);
        continue;
      }

      this._log(0, `Trying to instantiate '${type.name}'`);

      const instance = await createFunc((type) => this._requireFunction(type, 1));

      this._log(0, `'${type.name}' successfully instantiated.`);

      this._instances.set(type, instance);
    }
  }

  async _requireFunction(type, depth=0) {
    // requirement captured.

    this._log(depth, `Dependency '${type.name}' required.`);

    const createFuncForType = this._createFunctions.get(type);
    if (!createFuncForType) {
      throw new Error(`Required type '${type.name}' not found`);
    }

    this._log(depth, `Trying to resolve '${type.name}'.`);

    await this._resolveDependency(type, depth + 1);

    return this._instances.get(type);
  }

  async _resolveDependency(type, depth=0) {
    const createFunc = this._createFunctions.get(type);
    if (!createFunc) {
      throw new Error(`Required type '${type.name}' not found`);
    }

    // Dependency already created.
    const instancePredict = this._instances.get(type);
    if (instancePredict) {
      this._log(depth, `Instance of '${type.name}' resolved.`);
      return;
    }

    this._log(depth, `Instance not resolved. Instantiate '${type.name}'.`);

    const instance = await createFunc((type) => this._requireFunction(type, depth + 1));

    this._log(depth, `'${type.name}' instantiated.`);

    this._instances.set(type, instance);
  }

  _spaces(length) {
    return '  '.repeat(length);
  }

  _log(depth, message) {
    if (this.verbose) {
      console.log(`${this._spaces(depth)}${message}`);
    }
  }
}

export default Injector;


