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

import InteractionRepositoryImpl from '../../../../lib/interfaces/storage/InteractionRepositoryImpl';
import sequelize from '../../sequelizeMock';
import Feedback from '../../../../lib/domain/entities/Feedback';

describe('# getNotices', () => {
  it('should succeed', async () => {
    const repo = getRepository();
    const result = await repo.getNotices();

    result.forEach((each) => {
      expect(each).toHaveProperty('id');
      expect(each).toHaveProperty('title');
      expect(each).toHaveProperty('body');
    });
  });
});

describe('# getFeedbackReplies', () => {
  it('should catch null id', async () => {
    const repo = getRepository();
    const result = await repo.getFeedbackReplies(null);

    expect(result).toEqual([]);
  });

  it('should succeed', async () => {
    const repo = getRepository();
    const result = await repo.getFeedbackReplies(201701562);

    result.forEach((each) => {
      expect(each).toHaveProperty('id');
      expect(each).toHaveProperty('title');
      expect(each).toHaveProperty('userId');
      expect(each).toHaveProperty('feedbackId');
    });
  });
});

describe('# writeFeedback', () => {
  it('should catch null feedback', async () => {
    const repo = getRepository();
    const result = await repo.writeFeedback(null);

    expect(result).toEqual(false);
  });

  it('should succeed', async () => {
    const repo = getRepository();

    const createMock = jest.fn();
    sequelize.model('feedback').create = createMock;

    const feedback = new Feedback({
      id: null,
      userAgent: 'safari',
      content: 'blahblah',
      userId: 201701562,
    });
    const result = await repo.writeFeedback(feedback);

    expect(createMock).toBeCalledTimes(1);
    expect(result).toBe(true);
  });
});

const getRepository = function() {
  return new InteractionRepositoryImpl({
    db: sequelize,
  });
};
