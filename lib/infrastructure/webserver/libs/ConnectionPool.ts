/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2022 INU Global App Center <potados99@gmail.com>
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

import express from 'express';
import {logger} from '@inu-cafeteria/backend-core';

/**
 * Server-Side Event 구현을 위해 Express의 응답 객체를 잠시 묶어두는 커넥션 풀입니다.
 */
export default class ConnectionPool {
  private connections: Map<string, express.Response[]> = new Map();

  /**
   * 커넥션 추가.
   * 특정 주제에 관한 커넥션을 추가합니다.
   *
   * @param subject 주제.
   * @param res 응답 객체.
   */
  add(subject: string, res: express.Response) {
    const subjectPool = this.connections.get(subject) ?? [];
    this.connections.set(subject, subjectPool);

    if (subjectPool.includes(res)) {
      logger.warn('이미 풀에 들어 있는 커넥션입니다.');
      return;
    }

    if (res.headersSent) {
      logger.warn('이미 헤더가 전송된 커넥션입니다.');
      return;
    }

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    logger.info(`${subject} 풀에서 새 클라이언트와의 SSE 연결!! >_<`);

    res.on('close', () => {
      logger.info(`${subject} 풀에서 클라이언트와의 SSE 연결 종료 ㅠㅡㅠ`);

      this.removeFromPool(subjectPool, res);

      logger.info(`Active subject가 ${this.getActiveSubjects().length}개!`);
    });

    subjectPool.push(res);

    logger.info(`Active subject가 ${this.getActiveSubjects().length}개!`);
  }

  /**
   * 특정 주제에 관한 커넥션들에 대해 지정된 타입으로 데이터를 브로드캐스트합니다.
   *
   * @param subject 주제.
   * @param type 이벤트 타입.
   * @param data 페이로드.
   */
  async broadcast(subject: string, type: string, data: Record<string, any>) {
    const subjectPool = this.connections.get(subject) ?? [];

    for (const connection of subjectPool) {
      try {
        await new Promise<void>((res, rej) => {
          connection.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`, (error) => {
            if (error) {
              rej(error);
            } else {
              res();
            }
          });
        });
      } catch (e) {
        logger.warn(`write 실패! ${subject} 풀에서 커넥션을 제거합니다.`);
        this.removeFromPool(subjectPool, connection);
      }
    }
  }

  private removeFromPool(pool: express.Response[], res: express.Response) {
    pool.splice(pool.indexOf(res), 1);
  }

  /**
   * 현재 살아있는 커넥션이 최소 하나 이상 존재하는 주제를 모두 가져옵니다.
   */
  getActiveSubjects(): string[] {
    return Array.from(this.connections.entries())
      .filter(([k, v]) => v.length > 0)
      .map(([k, v]) => k);
  }
}
