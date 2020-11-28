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

import NoticeRepository from '../../domain/repositories/NoticeRepository';
import Notice from '../../domain/entities/Notice';

class NoticeRepositoryImpl extends NoticeRepository {
  constructor({db}) {
    super();

    this.db = db;
    this.noticeModel = this.db.model('notice');
  }

  async getAllNotices() {
    return this.noticeModel.findAll()
      .map((seqNotice) => this._seqNoticeToNotice(seqNotice));
  }

  async getNoticeById(id/* integer or 'latest' */) {
    if (!id) {
      return null;
    }

    if (id === 'latest') {
      return this._getLatestNotice();
    } else {
      const seqNotice = this.noticeModel.findByPk(id);

      if (!seqNotice) {
        return null;
      }

      return this._seqNoticeToNotice(seqNotice);
    }
  }

  async _getLatestNotice() {
    const maxNoticeId = await this.noticeModel.max('id');

    if (!maxNoticeId) {
      return null;
    }

    const seqNotice = this.noticeModel.findByPk(maxNoticeId);

    if (!seqNotice) {
      return null;
    }

    return this._seqNoticeToNotice(seqNotice);
  }

  _seqNoticeToNotice(seqNotice) {
    return new Notice({
      id: seqNotice.id,
      title: seqNotice.title,
      body: seqNotice.body,
    });
  }
}

export default NoticeRepositoryImpl;
