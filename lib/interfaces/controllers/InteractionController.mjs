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

import resolve from '../../common/di/resolve';

import FeedbackConverter from '../converters/FeedbackConverter';
import WriteFeedback from '../../domain/usecases/WriteFeedback';

import Boom from '@hapi/boom';
import GetNotifications from '../../domain/usecases/GetNotifications';
import NotificationSerializer from '../serializers/NotificationSerializer';
import GetNotices from '../../domain/usecases/GetNotices';
import NoticeSerializer from '../serializers/NoticeSerializer';

export default {

  async writeFeedback(request, h) {
    let id;
    if (request.auth.isAuthenticated) {
      id = request.auth.credentials.id;
    } else {
      id = -2; /* user without account */
    }

    const feedback = resolve(FeedbackConverter).convert({
      userAgent: request.headers['user-agent'],
      payload: request.payload,
      userId: id,
      });

    const result = await resolve(WriteFeedback).run({
      feedback: feedback,
    });

    if (result) {
      return h.response().code(204); /* send nothing */
    } else {
      return Boom.badImplementation('WHAT??');
    }
  },

  async getNotifications(request) {
    if (!request.auth.isAuthenticated) {
      // Only users with authentication can perform logout.
      return Boom.unauthorized('Missing authentication; Auth filtering before handler is disabled');
    }

    const {id} = request.auth.credentials;

    const notifications = await resolve(GetNotifications).run({userId: id});

    // Notifications might be empty.
    // That is not an error.

    return resolve(NotificationSerializer).serialize(notifications);
  },

  async getNotices(request) {
    const notices = await resolve(GetNotices).run();

    return resolve(NoticeSerializer).serialize(notices);
  },

};
