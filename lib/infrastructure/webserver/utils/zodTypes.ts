/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2021 INU Global App Center <potados99@gmail.com>
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

import {z} from 'zod';
import {isBoolean, isInt, toBoolean, toInt} from './parser';

/**
 * Express는 query와 params를 모두 string으로 줍니다.
 *
 * 따라서 만약 숫자로 된 인자를 받고 싶다면 ,
 * refine()을 통해 숫자 스트링만 걸러낸 뒤에 transform()으로 숫자로 변환해야 합니다.
 */

export const stringAsInt = z.string().refine(isInt).transform(toInt);
export const stringAsBoolean = z.string().refine(isBoolean).transform(toBoolean);
