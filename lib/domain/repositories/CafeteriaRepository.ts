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

import Cafeteria from '../entities/Cafeteria';
import Corner from '../entities/Corner';
import Menu from '../entities/Menu';
import CafeteriaComment from '../entities/CafeteriaComment';

export default abstract class CafeteriaRepository {
  abstract getAllCafeteria(): Promise<Cafeteria[]>;
  abstract getCafeteriaById(id: number): Promise<Cafeteria | undefined>;

  abstract getAllCorners(): Promise<Corner[]>;
  abstract getCornerById(id: number): Promise<Corner | undefined>;
  abstract getCornersByCafeteriaId(cafeteriaId: number): Promise<Corner[]>;

  abstract getAllMenus(dateString?: string): Promise<Menu[]>;
  abstract getMenusByCornerId(cornerId: number, dateString?: string): Promise<Menu[]>;

  abstract getAllComments(): Promise<CafeteriaComment[]>;
  abstract getCommentByCafeteriaId(cafeteriaId: number): Promise<CafeteriaComment | undefined>;

  abstract getCafeteriaIdByPosNumber(posNumber: number): Promise<number | undefined>;
}
