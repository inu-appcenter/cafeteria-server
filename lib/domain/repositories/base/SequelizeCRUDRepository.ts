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

import {Model, Repository} from 'sequelize-typescript';
import {FindOptions} from 'sequelize';
import SequelizeRawCRUDRepository from './SequelizeRawCRUDRepository';
import Entity from '../../entities/Entity';
import {parseObject, serializeObject} from '../../../common/utils/object';
import {camelToSnake, snakeToCamel} from '../../../common/utils/naming';

abstract class SequelizeCRUDRepository<
  E extends Entity<E>,
  M extends Model
> extends SequelizeRawCRUDRepository<M> {
  override async create(entity: E): Promise<number> {
    const values = serializeObject(entity, camelToSnake);

    return await super.create(values);
  }

  protected async read(id: number): Promise<E | null> {
    const seqResult = await super.read(id);

    return parseObject(seqResult.dataValues, snakeToCamel, this.entityClass);
  }

  protected async readAll(options?: FindOptions): Promise<Array<E>> {
    logger.verbose(`${this.entityName}를 다 가져오라구? 킄.. 좋아 원하는대로 해주지`);

    const result = (await this.repo.findAll(options))
      .map((seq: any) => seq.dataValues)
      .map((values: any) => parseObject(values, snakeToCamel, this.entityClass, false));

    logger.verbose(`무려 ${result.length}개나 겟또다제☆ 이제서야 만족스러운거냐구!`);

    return result;
  }

  protected async readRecent(limit?: number) {
    return await this.readAll({
      order: [[this.primaryKeyName, 'DESC']],
      limit: limit,
    });
  }

  protected async update(
    entity: E,
    ignoredFields: Array<keyof E> | null = null
  ): Promise<number> {
    logger.verbose(`좋아..${this.entityName}..변신!`);

    const values = serializeObject(entity, camelToSnake, ignoredFields);
    const options = this.getWhereClauseOptionSpecifyingPk(entity.id);

    // Update will be performed only when row exists,
    // otherwise, nothing will happen (not throw).
    const [numberOfAffectedRows] = await this.repo.update(values, options);

    logger.verbose(`${numberOfAffectedRows}개의 ${this.entityName}, 변신 완료!!!`);

    return numberOfAffectedRows;
  }
}

export default SequelizeCRUDRepository;
