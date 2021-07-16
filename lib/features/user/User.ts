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

import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import Question from '../qna/Question';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number; // TODO userId

  @Column()
  rememberMeToken: string; // TODO rename;

  /**
   * 사용자의 id와 바코드는 1:1 매칭되며, 상호 변환 가능합니다.
   */
  @Column()
  barcode: string;

  @OneToMany(() => Question, q => q.user)
  questions: Question[];
}
