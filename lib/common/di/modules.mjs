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

import ActivateBarcode from '../../domain/usecases/ActivateBarcode';
import TransactionRepository from '../../domain/repositories/TransactionRepository';
import CommitDiscountTransaction from '../../domain/usecases/CommitDiscountTransaction';
import DiscountTransactionValidator from '../../domain/validators/DiscountTransactionValidator';
import GetCafeteria from '../../domain/usecases/GetCafeteria';
import CafeteriaRepository from '../../domain/repositories/CafeteriaRepository';
import GetCorners from '../../domain/usecases/GetCorners';
import GetMenus from '../../domain/usecases/GetMenus';
import UserRepository from '../../domain/repositories/UserRepository';
import GetUser from '../../domain/usecases/GetUser';
import BarcodeTransformer from '../../domain/security/BarcodeTransformer';
import Login from '../../domain/usecases/Login';
import Logout from '../../domain/usecases/Logout';
import ValidateDiscountTransaction from '../../domain/usecases/ValidateDiscountTransaction';
import CafeteriaRepositoryImpl from '../../interfaces/storage/CafeteriaRepositoryImpl';
import MenuConverter from '../../interfaces/converters/MenuConverter';
import TransactionRepositoryImpl from '../../interfaces/storage/TransactionRepositoryImpl';
import UserRepositoryImpl from '../../interfaces/storage/UserRepositoryImpl';
import LegacyTransactionConverter from '../../interfaces/converters/LegacyTransactionConverter';
import CafeteriaSerializer from '../../interfaces/serializers/CafeteriaSerializer';
import CornerSerializer from '../../interfaces/serializers/CornerSerializer';
import MenuSerializer from '../../interfaces/serializers/MenuSerializer';
import UserSerializer from '../../interfaces/serializers/UserSerializer';
import DiscountTransactionValidatorImpl from '../../interfaces/validators/DiscountTransactionValidatorImpl';
import BarcodeTransformerImpl from '../../interfaces/security/BarcodeTransformerImpl';
import Authenticator from '../../domain/security/Authenticator';
import AuthenticatorImpl from '../../interfaces/security/AuthenticatorImpl';
import InteractionRepositoryImpl from '../../interfaces/storage/InteractionRepositoryImpl';
import InteractionRepository from '../../domain/repositories/InteractionRepository';
import GetNotices from '../../domain/usecases/GetNotices';
import GetFeedbackReplies from '../../domain/usecases/GetFeedbackReplies';
import WriteFeedback from '../../domain/usecases/WriteFeedback';
import FeedbackConverter from '../../interfaces/converters/FeedbackConverter';
import NoticeSerializer from '../../interfaces/serializers/NoticeSerializer';
import FeedbackReplySerializer from '../../interfaces/serializers/FeedbackReplySerializer';
import config from '../../../config';

export default [
  /**
   * Use Cases
   */
  {
    create: async (r) => new ActivateBarcode({
      transactionRepository: await r(TransactionRepository),
    }),
    as: ActivateBarcode,
  },
  {
    create: async (r) => new CommitDiscountTransaction({
      transactionRepository: await r(TransactionRepository),
      transactionValidator: await r(DiscountTransactionValidator),
    }),
    as: CommitDiscountTransaction,
  },
  {
    create: async (r) => new GetCafeteria({
      cafeteriaRepository: await r(CafeteriaRepository),
    }),
    as: GetCafeteria,
  },
  {
    create: async (r) => new GetCorners({
      cafeteriaRepository: await r(CafeteriaRepository),
    }),
    as: GetCorners,
  },
  {
    create: async (r) => new GetMenus({
      cafeteriaRepository: await r(CafeteriaRepository),
    }),
    as: GetMenus,
  },
  {
    create: async (r) => new GetNotices({
      interactionRepository: await r(InteractionRepository),
    }),
    as: GetNotices,
  },
  {
    create: async (r) => new GetFeedbackReplies({
      interactionRepository: await r(InteractionRepository),
    }),
    as: GetFeedbackReplies,
  },
  {
    create: async (r) => new GetUser({
      userRepository: await r(UserRepository),
    }),
    as: GetUser,
  },
  {
    create: async (r) => new Login({
      userRepository: await r(UserRepository),
      barcodeTransformer: await r(BarcodeTransformer),
    }),
    as: Login,
  },
  {
    create: async (r) => new Logout({
      userRepository: await r(UserRepository),
    }),
    as: Logout,
  },
  {
    create: async (r) => new ValidateDiscountTransaction({
      transactionRepository: await r(TransactionRepository),
      transactionValidator: await r(DiscountTransactionValidator),
    }),
    as: ValidateDiscountTransaction,
   },
  {
    create: async (r) => new WriteFeedback({
      interactionRepository: await r(InteractionRepository),
    }),
    as: WriteFeedback,
  },

  /**
   * Repositories
   */
  {
    create: async (r) => new CafeteriaRepositoryImpl({
      menuConverter: await r(MenuConverter),
    }),
    as: CafeteriaRepository,
  },
  {
    create: async (r) => new TransactionRepositoryImpl(),
    as: TransactionRepository,
  },
  {
    create: async (r) => new UserRepositoryImpl(),
    as: UserRepository,
  },
  {
    create: async (r) => new InteractionRepositoryImpl(),
    as: InteractionRepository,
  },

  /**
   * Converters
   */
  {
    create: async (r) => new FeedbackConverter(),
    as: FeedbackConverter,
  },
  {
    create: async (r) => new LegacyTransactionConverter({
      barcodeTransformer: await r(BarcodeTransformer),
    }),
    as: LegacyTransactionConverter,
  },
  {
    create: async (r) => new MenuConverter(config.cornerMenuKeys),
    as: MenuConverter,
  },

  /**
   * Serializers
   */
  {
    create: async (r) => new CafeteriaSerializer(),
    as: CafeteriaSerializer,
  },
  {
    create: async (r) => new CornerSerializer(),
    as: CornerSerializer,
  },
  {
    create: async (r) => new MenuSerializer(),
    as: MenuSerializer,
  },
  {
    create: async (r) => new NoticeSerializer(),
    as: NoticeSerializer,
  },
  {
    create: async (r) => new FeedbackReplySerializer(),
    as: FeedbackReplySerializer,
  },
  {
    create: async (r) => new UserSerializer(),
    as: UserSerializer,
  },

  /**
   * Validators
   */
  {
    create: async (r) => new DiscountTransactionValidatorImpl({
      transactionRepository: await r(TransactionRepository),
      cafeteriaRepository: await r(CafeteriaRepository),
      userRepository: await r(UserRepository),
    }),
    as: DiscountTransactionValidator,
  },

  /**
   * Security
   */
  {
    create: async (r) => new BarcodeTransformerImpl(),
    as: BarcodeTransformer,
  },
  {
    create: async (r) => new AuthenticatorImpl({
      userRepository: await r(UserRepository),
    }),
    as: Authenticator,
  },
];
