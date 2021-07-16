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
import NotifyOrderReady from '../../../domain/usecases/NotifyOrderReady.mjs';
import CloudMessageRepository from '../../../domain/repositories/CloudMessageRepository.mjs';
import AddWaitingOrder from '../../../domain/usecases/AddWaitingOrder.mjs';
import WaitingOrderRepository from '../../../domain/repositories/WaitingOrderRepository.mjs';
import DeleteWaitingOrder from '../../../domain/usecases/DeleteWaitingOrder.mjs';
import FindWaitingOrderByContent from '../../../domain/usecases/FindWaitingOrderByContent.mjs';
import GetWaitingOrders from '../../../domain/usecases/GetWaitingOrders.mjs';
import PurgeOldWaitingOrder from '../../../domain/usecases/PurgeOldWaitingOrder.mjs';
import MarkOrderDone from '../../../domain/usecases/MarkOrderDone.mjs';
import EveryHalfHour from '../../../domain/usecases/EveryHalfHour.mjs';
import GetCafeteriaComment from '../../../domain/usecases/GetCafeteriaComment.mjs';

const modules: Declaration<any>[] = [
  {
    create: async (r) =>
      new ActivateBarcode({
        transactionRepository: await r(TransactionRepository),
      }),
    as: ActivateBarcode,
  },
  {
    create: async (r) =>
      new CommitDiscountTransaction({
        transactionService: await r(TransactionService),
      }),
    as: CommitDiscountTransaction,
  },
  {
    create: async (r) =>
      new GetCafeteria({
        cafeteriaRepository: await r(CafeteriaRepository),
      }),
    as: GetCafeteria,
  },
  {
    create: async (r) =>
      new GetCorners({
        cafeteriaRepository: await r(CafeteriaRepository),
      }),
    as: GetCorners,
  },
  {
    create: async (r) =>
      new GetMenus({
        cafeteriaRepository: await r(CafeteriaRepository),
      }),
    as: GetMenus,
  },
  {
    create: async (r) =>
      new GetNotices({
        noticeRepository: await r(NoticeRepository),
      }),
    as: GetNotices,
  },
  {
    create: async (r) =>
      new GetQuestions({
        interactionRepository: await r(InteractionRepository),
      }),
    as: GetQuestions,
  },
  {
    create: async (r) =>
      new GetAnswers({
        interactionRepository: await r(InteractionRepository),
      }),
    as: GetAnswers,
  },
  {
    create: async (r) =>
      new GetUser({
        userRepository: await r(UserRepository),
      }),
    as: GetUser,
  },
  {
    create: async (r) =>
      new Login({
        userService: await r(UserService),
      }),
    as: Login,
  },
  {
    create: async (r) =>
      new Logout({
        userService: await r(UserService),
      }),
    as: Logout,
  },
  {
    create: async (r) =>
      new ValidateDiscountTransaction({
        transactionService: await r(TransactionService),
      }),
    as: ValidateDiscountTransaction,
  },
  {
    create: async (r) =>
      new Ask({
        interactionRepository: await r(InteractionRepository),
      }),
    as: Ask,
  },
  {
    create: async (r) =>
      new CheckIfUserShouldUpdateApp({
        appVersionRuleRepo: await r(AppVersionRuleRepository),
      }),
    as: CheckIfUserShouldUpdateApp,
  },
  {
    create: async (r) =>
      new MarkAnswerRead({
        interactionRepository: await r(InteractionRepository),
      }),
    as: MarkAnswerRead,
  },
  {
    create: async (r) =>
      new SendEmail({
        emailRepository: await r(EmailRepository),
      }),
    as: SendEmail,
  },
  {
    create: async (r) =>
      new NotifyOrderReady({
        cloudMessageRepository: await r(CloudMessageRepository),
      }),
    as: NotifyOrderReady,
  },
  {
    create: async (r) =>
      new AddWaitingOrder({
        waitingOrderRepository: await r(WaitingOrderRepository),
      }),
    as: AddWaitingOrder,
  },
  {
    create: async (r) =>
      new DeleteWaitingOrder({
        waitingOrderRepository: await r(WaitingOrderRepository),
      }),
    as: DeleteWaitingOrder,
  },
  {
    create: async (r) =>
      new FindWaitingOrderByContent({
        waitingOrderRepository: await r(WaitingOrderRepository),
      }),
    as: FindWaitingOrderByContent,
  },
  {
    create: async (r) =>
      new GetWaitingOrders({
        waitingOrderRepository: await r(WaitingOrderRepository),
      }),
    as: GetWaitingOrders,
  },
  {
    create: async (r) =>
      new PurgeOldWaitingOrder({
        waitingOrderRepository: await r(WaitingOrderRepository),
      }),
    as: PurgeOldWaitingOrder,
  },
  {
    create: async (r) =>
      new MarkOrderDone({
        waitingOrderRepository: await r(WaitingOrderRepository),
      }),
    as: MarkOrderDone,
  },
  {
    create: async (r) =>
      new EveryHalfHour({
        getMenus: await r(GetMenus),
        purgeOldWaitingOrder: await r(PurgeOldWaitingOrder),
      }),
    as: EveryHalfHour,
  },
  {
    create: async (r) =>
      new GetCafeteriaComment({
        cafeteriaRepository: await r(CafeteriaRepository),
      }),
    as: GetCafeteriaComment,
  },
];

export default modules;
