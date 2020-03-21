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
    this._mockedInstances = new Map();
  }

  /**
   * Initialize an injector with given declaration(s).
   *
   * @param {[]|{create, as}} declaration of instances.
   * @param {boolean} verbose print logs or not.
   */
  async init(declaration, verbose=false) {
    if (!declaration) {
      throw new Error('Cannot init Injector: invalid declaration');
    }

    // In case of re-init, clear all collections.
    this._createFunctions.clear();
    this._instances.clear();
    this.verbose = verbose;

    const insertCreateFunction = (singleDeclaration) => {
      if (!singleDeclaration.as || !singleDeclaration.create) {
        throw new Error('Cannot init Injector: wrong declaration');
      }

      if (typeof singleDeclaration.as !== 'function' || typeof singleDeclaration.create !== 'function') {
        throw new Error('Cannot init Injector: wrong declaration');
      }

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
   * @return {*} instance of that class.
   */
  resolve(classType) {
    if (!classType) {
      throw new Error('Cannot resolve: invalid type');
    }

    const instance = this._findInstance(classType);
    if (!instance) {
      throw new Error(`Cannot resolve: no instance of '${this._safeName(classType)}'`);
    }

    return instance;
  }

  /**
   * Set a persistent mock for a classType.
   *
   * @param classType
   * @param instance
   */
  mock(classType, instance) {
    if (!classType) {
      throw new Error('Cannot mock: invalid classType');
    }

    this._mockedInstances.set(classType, {
      instance: instance,
      persist: true,
    });
  }

  /**
   * Set a one-time use mock for a classType.
   *
   * @param classType
   * @param instance
   */
  mockOnce(classType, instance) {
    if (!classType) {
      throw new Error('Cannot mockOnce: invalid classType');
    }

    this._mockedInstances.set(classType, {
      instance: instance,
      persist: false,
    });
  }

  /**
   * Clear mock for a classType.
   *
   * @param classType
   */
  mockClear(classType) {
    if (!classType) {
      throw new Error('Cannot mockClear: invalid classType');
    }

    this._mockedInstances.delete(classType);
  }

  _findInstance(classType) {
    const mocked = this._mockedInstances.get(classType);
    if (mocked) {
      if (!mocked.persist) {
        this._mockedInstances.delete(classType);
      }
      return mocked.instance;
    }

    return this._instances.get(classType);
  }

  async _instantiateAll() {
    for (const entry of this._createFunctions) {
      const type = entry[0]; /* key */
      const createFunc = entry[1]; /* value */

      const instancePredict = this._instances.get(type);
      if (instancePredict) {
        this._log(0, `'${this._safeName(type)}' is already instantiated. Pass`);
        continue;
      }

      this._log(0, `Trying to instantiate '${this._safeName(type)}'`);

      const instance = await createFunc((type) => this._requireInstance(type, 1));

      this._log(0, `'${this._safeName(type)}' successfully instantiated.`);

      this._instances.set(type, instance);
    }
  }

  async _requireInstance(type, depth=0) {
    // requirement captured.

    this._log(depth, `Dependency '${this._safeName(type)}' required.`);

    const createFuncForType = this._createFunctions.get(type);
    if (!createFuncForType) {
      throw new Error(`Required type '${this._safeName(type)}' not found`);
    }

    this._log(depth, `Trying to resolve '${this._safeName(type)}'.`);

    await this._resolveDependency(type, depth + 1);

    return this._instances.get(type);
  }

  async _resolveDependency(type, depth=0) {
    const createFunc = this._createFunctions.get(type);
    if (!createFunc) {
      throw new Error(`Required type '${this._safeName(type)}' not found`);
    }

    // Dependency already created.
    const instancePredict = this._instances.get(type);
    if (instancePredict) {
      this._log(depth, `Instance of '${this._safeName(type)}' resolved.`);
      return;
    }

    this._log(depth, `Instance not resolved. Instantiate '${this._safeName(type)}'.`);

    const instance = await createFunc((type) => this._requireInstance(type, depth + 1));

    this._log(depth, `'${this._safeName(type)}' instantiated.`);

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

  _safeName(type) {
    if (!type) {
      return 'undefined';
    } else if (!type.name) {
      return 'anonymous';
    } else {
      return type.name;
    }
  }
}

export default Injector;


