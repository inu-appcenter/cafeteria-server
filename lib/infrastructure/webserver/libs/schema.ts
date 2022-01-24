/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2021 INU Global App Center <potados99@gmail.com>
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

import {ZodRawShape} from 'zod/lib/types';
import {z} from 'zod';

type RawSchema<
  TParams extends ZodRawShape,
  TQuery extends ZodRawShape,
  TBody extends ZodRawShape
> = {
  params?: TParams;
  query?: TQuery;
  body?: TBody;
};

export function defineSchema<
  TParams extends ZodRawShape,
  TQuery extends ZodRawShape,
  TBody extends ZodRawShape
>(raw: RawSchema<TParams, TQuery, TBody>) {
  return {
    params: raw.params ? z.object(raw.params) : undefined,
    query: raw.query ? z.object(raw.query) : undefined,
    body: raw.body ? z.object(raw.body) : undefined,
  };
}
