/*
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

import {Declaration} from '../Injector';
import Sequelize from 'sequelize';
import WaitingOrderRepositoryImpl from '../../../interfaces/storage/WaitingOrderRepositoryImpl.mjs';
import WaitingOrderRepository from '../../../domain/repositories/WaitingOrderRepository.mjs';
import CloudMessageRepositoryImpl from '../../../interfaces/storage/CloudMessageRepositoryImpl.mjs';
import CloudMessageRepository from '../../../domain/repositories/CloudMessageRepository.mjs';

const modules: Declaration<any>[] = [
  {
    create: async (r) =>
      new CafeteriaRepositoryImpl({
        db: await r(Sequelize),
        remoteDataSource: await r(CafeteriaRemoteDataSource),
        menuConverter: await r(DirectMenuConverter),
      }),
    as: CafeteriaRepository,
  },
  {
    create: async (r) =>
      new TransactionRepositoryImpl({
        db: await r(Sequelize),
      }),
    as: TransactionRepository,
  },
  {
    create: async (r) =>
      new UserRepositoryImpl({
        db: await r(Sequelize),
        localDataSource: await r(UserLocalDataSource),
        remoteDataSource: await r(UserRemoteDataSource),
      }),
    as: UserRepository,
  },
  {
    create: async (r) =>
      new InteractionRepositoryImpl({
        db: await r(Sequelize),
      }),
    as: InteractionRepository,
  },
  {
    create: async (r) => new CoopRepositoryImpl(),
    as: CoopRepository,
  },
  {
    create: async (r) =>
      new ParseRegexRepositoryImpl({
        db: await r(Sequelize),
      }),
    as: ParseRegexRepository,
  },
  {
    create: async (r) =>
      new AppVersionRuleRepositoryImpl({
        db: await r(Sequelize),
      }),
    as: AppVersionRuleRepository,
  },
  {
    create: async (r) =>
      new NoticeRepositoryImpl({
        db: await r(Sequelize),
      }),
    as: NoticeRepository,
  },
  {
    create: async (r) => new EmailRepositoryImpl(),
    as: EmailRepository,
  },
  {
    create: async (r) =>
      new WaitingOrderRepositoryImpl({
        db: await r(Sequelize),
      }),
    as: WaitingOrderRepository,
  },
  {
    create: async (r) => new CloudMessageRepositoryImpl(),
    as: CloudMessageRepository,
  },
];

export default modules;
