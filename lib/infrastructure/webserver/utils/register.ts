/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2021 INU Global App Center <potados99@gmail.com>
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

import * as fs from 'fs';
import express from 'express';
import {logger} from '@inu-cafeteria/backend-core';

export async function registerRoutes(app: express.Application, dir: string = '/routes') {
  const files = fs.readdirSync(dir);

  for (const path of files) {
    if (path.startsWith('.') || path.startsWith('_')) {
      continue;
    }

    const filePath = dir + '/' + path;
    const stats = fs.lstatSync(filePath);

    const isFile = stats.isFile();
    const isSourceFile = path.endsWith('.ts') || path.endsWith('.js');

    if (isFile && isSourceFile) {
      logger.info(`라우터를 등록합니다: ${path}`);

      const router = (await import(filePath)).default as express.Router;

      app.use(router);
    } else if (stats.isDirectory()) {
      await registerRoutes(app, filePath);
    }
  }
}
