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

export function serializeObject<T extends object>(
  originalObject: T,
  fieldTransform: (fieldName: string) => string,
  exclude: Array<keyof T> | null = null
): any {
  const serialized: any = {};

  for (const originalField in originalObject) {
    if (!Object.hasOwnProperty.call(originalObject, originalField)) {
      continue;
    }

    if (exclude !== null && stringIn(originalField, exclude)) {
      continue;
    }

    const newField = fieldTransform(originalField);
    serialized[newField] = originalObject[originalField];
  }

  return serialized;
}

function stringIn(str: string, collection: any[]) {
  return collection.indexOf(str) >= 0;
}

export function parseObject<T extends object>(
  rawObject: any,
  fieldTransform: (fieldName: string) => string,
  outputObjectType: {new (): T},
  leaveOnlyParsedParts: boolean = false /* set all non-parsed fields in the instance of T to undefined. */
): T {
  const parsed = new outputObjectType();
  const assignedFields = [];

  for (const rawField in rawObject) {
    if (!Object.hasOwnProperty.call(rawObject, rawField)) {
      continue;
    }

    const objectField = fieldTransform(rawField);

    if (!Object.hasOwnProperty.call(parsed, objectField)) {
      // Wrong field
      continue;
    }

    // @ts-ignore
    parsed[objectField] = rawObject[rawField];
    assignedFields.push(objectField);
  }

  if (leaveOnlyParsedParts) {
    removeFields(parsed, assignedFields);
  }

  return parsed;
}

function removeFields<T>(object: T, exclude: Array<string>) {
  for (const field in object) {
    if (!Object.hasOwnProperty.call(object, field)) {
      continue;
    }

    if (stringIn(field, exclude)) {
      continue;
    }

    // @ts-ignore
    object[field] = undefined;
  }

  return object;
}

export function assignIfValid(object: any, key: string, value: any | undefined, validator: (value?: any) => boolean) {
  if (validator(value)) {
    object[key] = value;
  }
}
