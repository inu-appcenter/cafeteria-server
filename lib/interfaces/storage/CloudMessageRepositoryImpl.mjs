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

import CloudMessageRepository from '../../domain/repositories/CloudMessageRepository.mjs';
import admin from 'firebase-admin';
import logger from '../../common/utils/logger.mjs';

class CloudMessageRepositoryImpl extends CloudMessageRepository {
  constructor() {
    super();

    this.firebaseApp = this._initializeFirebaseAdmin();
  }

  _initializeFirebaseAdmin() {
    try {
      return admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    } catch (e) {
      logger.error(`Cannot initialize firebase admin: ${e.message}`);

      return null;
    }
  }

  async sendOrderReadyMessage(order) {
    const message = {
      notification: {
        title: '주문하신 음식이 나왔어요!',
        body: '픽업대에서 기다리고 있습니다 :)',
      },
      data: {
        number: order.number,
        cafeteria_id: order.cafeteriaId,
      },
      token: order.fcmToken,
    };

    if (!this.firebaseApp) {
      logger.error(`Cannot send firebase cloud message: this.firebaseApp unavailable`);

      return null;
    }

    try {
      return await this.firebaseApp.messaging().send(message);
    } catch (e) {
      logger.warn(`Cannot send firebase cloud message: ${e.message}`);

      return null;
    }
  }
}

export default CloudMessageRepositoryImpl;
