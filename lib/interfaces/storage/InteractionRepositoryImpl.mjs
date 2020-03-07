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
import Notification from '../../domain/entities/Notification';

import sequelize from '../../infrastructure/database/sequelize';
import logger from '../../common/utils/logger';

import seq from 'sequelize';
import Notice from '../../domain/entities/Notice';
const {Sequelize} = seq;

class InteractionRepositoryImpl extends InteractionRepository {
  constructor() {
    super();

    this.db = sequelize;

    this.feedbackModel = this.db.model('feedback');
    this.notificationModel = this.db.model('notification');
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

  async getNotifications(userId) {
    // Find all unread notification of user.
    const seqNotificationsNotRead = await this.notificationModel.findAll({
      where: {
        user_id: userId,
        delivered_at: null,
      },
    });

    // Consider as read and update delivered time.
    for (const seqNotification of seqNotificationsNotRead) {
      await seqNotification.update({
        delivered_at: Sequelize.fn('NOW'),
      });
    }

    return seqNotificationsNotRead.map((seqNotification) => {
      return new Notification({
        title: seqNotification.title,
        body: seqNotification.body,
        userId: seqNotification.user_id,
      });
    });
  }

  async tryWriteFeedback(feedback) {
    try {
      await this.feedbackModel.create({
        user_agent: feedback.userAgent,
        content: feedback.content,
        user_id: feedback.userId,

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
