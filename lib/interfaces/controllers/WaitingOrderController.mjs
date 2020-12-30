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

import WaitingOrderConverter from '../converters/WaitingOrderConverter.mjs';
import AddWaitingOrder from '../../domain/usecases/AddWaitingOrder.mjs';
import WaitingOrderMutationResult from '../../domain/constants/WaitingOrderMutationResult.mjs';
import Boom from '@hapi/boom';
import DeleteWaitingOrder from '../../domain/usecases/DeleteWaitingOrder.mjs';
import GetWaitingOrders from '../../domain/usecases/GetWaitingOrders.mjs';
import WaitingOrderSerializer from '../serializers/WaitingOrderSerializer.mjs';
import FindWaitingOrderByContent from '../../domain/usecases/FindWaitingOrderByContent.mjs';
import NotifyOrderReady from '../../domain/usecases/NotifyOrderReady.mjs';
import resolve from '../../common/di/resolve.mjs';
import cafeCodeToCafeteriaId from '../legacy/pushNumber/cafeCode.mjs';
import WaitingOrderValidator from '../../domain/validators/WaitingOrderValidator.mjs';

export default {

  async getWaitingOrders(request) {
    const {deviceIdentifier} = request.query;

    const waitingOrdersFound = await resolve(GetWaitingOrders).run({
      deviceIdentifier: deviceIdentifier,
    });

    return resolve(WaitingOrderSerializer).serialize(waitingOrdersFound);
  },

  async addWaitingOrder(request, h) {
    const {number, cafeteriaId, posNumber, deviceIdentifier} = request.payload;

    if (!cafeteriaId && !posNumber) {
      return Boom.badRequest('At least one of cafeteriaId and posNumber should be valid!');
    }

    const order = await resolve(WaitingOrderConverter).convert({
      number: number,
      posNumber: posNumber,
      cafeteriaId: cafeteriaId,
      deviceIdentifier: deviceIdentifier,
    });

    const result = await resolve(AddWaitingOrder).run({
      order: order,
    });

    return handleWaitingOrderMutationResult(h, result);
  },

  async deleteWaitingOrder(request, h) {
    const {orderId} = request.params;
    const {deviceIdentifier} = request.query;

    const userGotTheRightOrder = await resolve(WaitingOrderValidator).orderShouldBeAUsersOwn(orderId, deviceIdentifier);
    if (!userGotTheRightOrder) {
      return Boom.notFound('The order does not exist or user has no permission on it.');
    }

    const result = await resolve(DeleteWaitingOrder).run({
      waitingOrderId: orderId,
    });

    return handleWaitingOrderMutationResult(h, result);
  },

  /**
   * A webhook receiver.
   * If a waiting order with specified 'number' and 'code' exists,
   * it will send a notification to its registerer.
   *
   * @param request
   * @param h
   * @return {Promise<Boom<unknown>|*>}
   */
  async pushNumber(request, h) {
    const {num, code} = request.query;

    const waitingOrderFound = await resolve(FindWaitingOrderByContent).run({
      number: num,
      cafeteriaId: cafeCodeToCafeteriaId(code),
    });

    if (!waitingOrderFound) {
      return Boom.notFound(`Order(number: ${num}, code: ${code}) does not exist.`);
    }

    await resolve(NotifyOrderReady).run({
      order: waitingOrderFound,
    });

    await resolve(DeleteWaitingOrder).run({
      waitingOrderId: waitingOrderFound.id,
    });

    return h.response().code(204);
  },

};

function handleWaitingOrderMutationResult(h, result) {
  switch (result) {
    case WaitingOrderMutationResult.OK:
      return h.response().code(204); /* send nothing */

    case WaitingOrderMutationResult.ERROR:
      return Boom.badImplementation('Cannot add waiting order!');

    case WaitingOrderMutationResult.WRONG_PARAM:
      return Boom.badRequest('Wrong parameter.');

    case WaitingOrderMutationResult.ORDER_NOT_EXIST:
      return Boom.notFound('The order does not exist.');

    case WaitingOrderMutationResult.ORDER_ALREADY_REGISTERED:
      return Boom.forbidden('This order is already registered.');

    default:
      return Boom.badImplementation('WHAT????');
  }
}
