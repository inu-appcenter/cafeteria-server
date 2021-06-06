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
import VersionAssertionEvaluator from '../../common/utils/VersionAssertionEvaluator.mjs';

class NoticeRepositoryImpl extends NoticeRepository {
  constructor({db}) {
    super();

    this.db = db;
    this.noticeModel = this.db.model('notice');
    this.versionEvaluator = new VersionAssertionEvaluator();
  }

  /**
   * Notice behavior:
   * If os or version is specified, find notices matching that options.
   * Otherwise(not specified), only wild-carded notices will be returned.
   *
   * @param os
   * @param version
   * @return {Promise<*>}
   */
  async getAllNotices({os, version}) {
    const filter = this._getOptionFilter(os, version);

    const seqNotices = await this.noticeModel.findAll({order: [['id', 'DESC']]});

    return seqNotices
      .filter((seqNotice) => filter(seqNotice))
      .map((seqNotice) => this._seqNoticeToNotice(seqNotice));
  }

  async getNoticeById(id/* integer or 'latest' */, options) {
    if (id === 'latest') {
      return this._getLatestNotice(options);
    } else {
      return this._getNoticeById(options);
    }
  }

  _getOptionFilter(os, version) {
    return (seqNotice) => this._filterVersion(seqNotice, version) && this._filterOs(seqNotice, os);
  }

  _filterVersion(seqNotice, version) {
    if (!version) {
      // For clients who did not explicitly tell the version string,
      // only notices targeting every(*) versions will be returned.
      // Other specific-version-targeted notices will not be shown.
      return this._isItMeaningNotSpecifying(seqNotice.target_version);
    }

    // Filter only notices that match version.
    return this.versionEvaluator.evaluate({value: version, assertion: seqNotice.target_version});
  }

  _filterOs(seqNotice, os) {
    if (!os) {
      // For clients who did not explicitly tell the os string,
      // only notices targeting every(*) os's will be returned.
      // Other specific-os-targeted notices will not be shown.
      return this._isItMeaningNotSpecifying(seqNotice.target_os);
    }

    return this._isItMeaningNotSpecifying(seqNotice.target_os) || seqNotice.target_os === os;
  }

  _isItMeaningNotSpecifying(assertion) {
    return (assertion === '*' || assertion === '' || assertion === null || assertion === undefined);
  }

  async _getLatestNotice(options) {
    const allNotices = await this.getAllNotices(options);

    // Most recent
    if (allNotices.length > 0) {
      return allNotices.reduce((prev, current) => (prev.id > current.id) ? prev : current);
    } else {
      return null;
    }
  }

  async _getNoticeById(id, options) {
    if (!id) {
      return null;
    }

    const allNotices = await this.getAllNotices(options);

    return allNotices.find((notice) => notice.id === id);
  }

  _seqNoticeToNotice(seqNotice) {
    return new Notice({
      id: seqNotice.id,
      title: seqNotice.title,
      body: seqNotice.body,
      createdAt: seqNotice.createdAt,
    });
  }
}

export default NoticeRepositoryImpl;
