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
import GetFeedbackReplies from '../../domain/usecases/GetFeedbackReplies';
import FeedbackReplySerializer from '../serializers/FeedbackReplySerializer';
import GetNotices from '../../domain/usecases/GetNotices';
import NoticeSerializer from '../serializers/NoticeSerializer';

export default {

  async writeFeedback(request, h) {
    let userId;
    if (request.auth.isAuthenticated) {
      userId = request.auth.credentials.id;
    } else {
      // user_id of feedbacks scheme is set to allow null.
      // Any non-null user_id MUST refer to a valid user instance in users table.
      // So we need to set null if user id is not specified(not logged in).
      userId = null;
    }

    const feedback = resolve(FeedbackConverter).convert({
      userAgent: request.headers['user-agent'],
      payload: request.payload,
      userId: userId,
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

  async getFeedbackReplies(request) {
    if (!request.auth.isAuthenticated) {
      // Only users with authentication can perform logout.
      return Boom.unauthorized('Missing authentication; Auth filtering before handler is disabled');
    }

    const {id} = request.auth.credentials;

    const replies = await resolve(GetFeedbackReplies).run({userId: id});

    // Notifications might be empty.
    // That is not an error.

    return resolve(FeedbackReplySerializer).serialize(replies);
  },

  async getNotices(request) {
    const notices = await resolve(GetNotices).run();

    return resolve(NoticeSerializer).serialize(notices);
  },

};
