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

type Creator<T> = (resolve: Resolver<any>) => T;
type Resolver<T> = (classType: ClassType<T>) => T;

export type ClassType<T> = Function & {prototype: T};

export type Declaration<T> = {
  as: ClassType<T>;
  create: Creator<T>;
};

export default class Injector {
  private verbose: boolean = true;
  private createFunctions: Map<ClassType<any>, Creator<any>> = new Map();
  private instances: Map<ClassType<any>, any> = new Map();

  /**
   * Initialize an injector with given declaration(s).
   *
   * @param {[]|{create, as}} declarations of instances.
   * @param {boolean} verbose print logs or not.
   */
  start(declarations: Declaration<any>[], verbose: boolean = false) {
    // In case of re-init, clear all collections.
    this.createFunctions.clear();
    this.instances.clear();
    this.verbose = verbose;

    for (const declaration of declarations) {
      this.createFunctions.set(declaration.as, declaration.create);
    }
  }

  /**
   * Resolve an instance of a class.
   *
   * @param {Function} classType type of a class
   * @return {*} instance of that class.
   */
  resolve<T>(classType: ClassType<T>): T {
    return this.findOrCreateInstance(classType);
  }

  private findOrCreateInstance<T>(classType: ClassType<T>): T {
    if (this.instances.get(classType) === undefined) {
      this.createInstance(classType);
    }

    return this.instances.get(classType);
  }

  private createInstance<T>(classType: ClassType<T>, depth: number = 0) {
    const creator = this.createFunctions.get(classType);
    if (creator === undefined) {
      throw new Error(`No definition found for ${this.safeName(classType)}.`);
    }

    this.log(depth, `Trying to instantiate '${this.safeName(classType)}'`);

    const newInstance = creator((type) => this.findOrCreateInstance(type));

    this.log(depth, `'${this.safeName(classType)}' successfully instantiated.`);

    this.instances.set(classType, newInstance);

    return newInstance;
  }

  private spaces(length: number) {
    return '  '.repeat(length);
  }

  private log(depth: number, message: string) {
    if (this.verbose) {
      console.log(`${this.spaces(depth)}${message}`);
    }
  }

  private safeName(classType: ClassType<any>) {
    if (!classType) {
      return 'undefined';
    } else if (!classType.name) {
      return 'anonymous';
    } else {
      return classType.name;
    }
  }
}
