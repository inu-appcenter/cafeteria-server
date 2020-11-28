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
import sequelize from '../../infrastructure/database/sequelizeMock';
import Question from '../../../../lib/domain/entities/Question';

describe('# getFeedbackReplies', () => {
  it('should catch null id', async () => {
    const repo = getRepository();
    const result = await repo.getAllAnswers(null);

    expect(result).toEqual([]);
  });

  it('should succeed', async () => {
    const repo = getRepository();
    const result = await repo.getAllAnswers(201701562);

    result.forEach((each) => {
      expect(each).toHaveProperty('id');
      expect(each).toHaveProperty('title');
      expect(each).toHaveProperty('body');
      expect(each).toHaveProperty('read');
      expect(each).toHaveProperty('userId');
      expect(each).toHaveProperty('questionId');
      expect(each).toHaveProperty('createdAt');
    });
  });
});

describe('# writeFeedback', () => {
  it('should catch null feedback', async () => {
    const repo = getRepository();
    const result = await repo.ask(null);

    expect(result).toEqual(false);
  });

  it('should succeed', async () => {
    const repo = getRepository();

    const createMock = jest.fn();
    sequelize.model('question').create = createMock;

    const question = new Question({
      id: null,
      deviceInfo: 'ios safari',
      version: '4.0.0',
      content: 'blahblah',
      userId: 201701562,
      createdAt: Date.now(),
    });
    const result = await repo.ask(question);

    expect(createMock).toBeCalledTimes(1);
    expect(result).toBe(true);
  });
});

const getRepository = function() {
  return new InteractionRepositoryImpl({
    db: sequelize,
  });
};
