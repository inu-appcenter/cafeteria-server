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

import InteractionRepository from '../../domain/repositories/InteractionRepository';
import FeedbackReply from '../../domain/entities/FeedbackReply';

import logger from '../../common/utils/logger';

import seq from 'sequelize';
import Notice from '../../domain/entities/Notice';
const {Sequelize} = seq;

class InteractionRepositoryImpl extends InteractionRepository {
  constructor({db}) {
    super();

    this.db = db;

    this.feedbackModel = this.db.model('feedback');
    this.replyModel = this.db.model('feedback_reply');
    this.noticeModel = this.db.model('notice');
  }

  getNotices() {
    return this.noticeModel.findAll().map((seqNotice) => {
      return new Notice({
        id: seqNotice.id,
        title: seqNotice.title,
        body: seqNotice.body,
      });
    });
  }

  async getFeedbackReplies(userId) {
    if (!userId) {
      return [];
    }

    // Find all unread notification of user.
    const seqRepliesNotRead = await this.replyModel.findAll({
      where: {
        user_id: userId,
        delivered_at: null,
      },
    });

    await this._markRead(seqRepliesNotRead);

    return seqRepliesNotRead.map((seqReply) => {
      return new FeedbackReply({
        id: seqReply.id,
        title: seqReply.title,
        body: seqReply.body,
        userId: seqReply.user_id,
        feedbackId: seqReply.feedbackId,
      });
    });
  }

  async _markRead(seqReplies) {
    for (const seqReplyNotRead of seqReplies) {
      await seqReplyNotRead.update({
        delivered_at: Sequelize.fn('NOW'),
      });
    }
  }

  async writeFeedback(feedback) {
    if (!feedback) {
      return false;
    }

    if (!feedback.userAgent || !feedback.content || !feedback.userId) {
      return false;
    }

    try {
      await this.feedbackModel.create({
        /* id is auto increased */
        user_agent: feedback.userAgent,
        content: feedback.content,
        user_id: feedback.userId,

        /* DB only field */
        created_at: Sequelize.fn('NOW'),
      });

      return true;
    } catch (e) {
      logger.error(e);

      return false;
    }
  }
}

export default InteractionRepositoryImpl;
