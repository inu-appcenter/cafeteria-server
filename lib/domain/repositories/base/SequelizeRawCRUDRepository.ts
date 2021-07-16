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
import logger from '../../../common/utils/logger';
import sequelize from '../../../infrastructure/database/sequelize';

abstract class SequelizeRawCRUDRepository<M extends Model> {
  private readonly repo: Repository<M>;
  private readonly modelName: string;

  protected constructor(
    private readonly modelClass: {new (): M},
    private readonly primaryKeyName: string = 'id'
  ) {
    this.repo = sequelize.getRepository(modelClass);
    this.modelName = modelClass.name;

    logger.verbose(`5252 이봐 ${this.modelName}! 네놈 repo는 내가 처리하지!`);
  }

  protected async create(entity: object): Promise<number> {
    logger.verbose(
      `받아들여라,,, ${this.modelName} ${JSON.stringify(entity)}.., 새로운 가조쿠다!!`
    );

    try {
      await this.repo.create(entity);
    } catch (e) {
      logger.error(e.message);
      logger.verbose(`으윽..., 새로운 ${this.modelName}을(를) 맞이할 수 없었다!`);

      return 0;
    }

    logger.verbose(`좋아, 새로운 ${this.modelName}을(를) 환영한다!`);

    return 1;
  }

  protected async read(id: number): Promise<M | null> {
    logger.verbose(
      `${id}번 ${this.modelName}을(를) 가져오라구? 킄.. 좋아 원하는대로 해주지`
    );

    const seqResult = await this.repo.findByPk(id);

    if (!seqResult) {
      logger.verbose(`그치만....${id}번 ${this.modelName}같은 건 존재하지 않는걸!!!`);
      return null;
    }

    return seqResult;
  }

  protected async readAll(options?: FindOptions): Promise<Array<M>> {
    logger.verbose(`${this.modelName}를 다 가져오라구? 킄.. 좋아 원하는대로 해주지`);

    const result = await this.repo.findAll(options);
    logger.verbose(`무려 ${result.length}개나 겟또다제☆ 이제서야 만족스러운거냐구!`);

    return result;
  }

  protected async readRecent(limit?: number) {
    return await this.readAll({
      order: [[this.primaryKeyName, 'DESC']],
      limit: limit,
    });
  }

  protected async update(entity: object): Promise<number> {
    logger.verbose(`좋아..${this.modelName}..변신!`);

    // @ts-ignore
    const options = this.getWhereClauseOptionSpecifyingPk(entity[this.primaryKeyName]);

    // Update will be performed only when row exists,
    // otherwise, nothing will happen (not throw).
    const [numberOfAffectedRows] = await this.repo.update(entity, options);

    logger.verbose(`${numberOfAffectedRows}개의 ${this.modelName}, 변신 완료!!!`);

    return numberOfAffectedRows;
  }

  protected async delete(id: number): Promise<number> {
    logger.verbose(
      `오마에...${id}번 ${this.modelName}을(를) 지우라고 한거냐!?! 크흑...어쩔 수 없군..`
    );

    const options = this.getWhereClauseOptionSpecifyingPk(id);

    // Delete will be performed only when row exists,
    // otherwise, nothing will happen (not throw).
    const numberOfAffectedRows = await this.repo.destroy(options);

    logger.verbose(
      `${numberOfAffectedRows}개의 ${this.modelName}이(가) 비트가 되어 흩어졌다...`
    );

    return numberOfAffectedRows;
  }

  private getWhereClauseOptionSpecifyingPk(id: any) {
    const clause = {};
    // @ts-ignore
    clause[this.primaryKeyName] = id;

    return {where: clause};
  }
}

export default SequelizeRawCRUDRepository;
