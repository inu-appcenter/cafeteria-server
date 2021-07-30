import {ErrorRequestHandler, RequestHandler} from 'express';
import HttpError from '../../../common/errors/http/HttpError';
import {stringifyError} from '../../../common/utils/error';
import logger from '../../../common/logging/logger';
import {AssertionError} from 'assert';

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

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (isHttpError(err)) {
    logger.info(`HTTP 에러가 발생했습니다: ${stringifyError(err)}`);

    const {statusCode, error, message} = err;

    return res.status(statusCode).json({
      statusCode,
      error,
      message,
    });
  } else if (isAssertionError(err)) {
    logger.warn(`Assertion 에러가 발생했습니다: ${stringifyError(err)}`);

    const {message} = err;

    return res.status(500).json({
      statusCode: 500,
      error: 'assertion_failed',
      message,
    });
  } else {
    logger.error(`처리되지 않은 에러가 발생했습니다: ${stringifyError(err)}`);

    return res.status(500).json({
      statusCode: 500,
      error: 'unhandled',
      message: stringifyError(err),
    });
  }
};

function isHttpError(error: Error): error is HttpError {
  return error instanceof HttpError;
}

function isAssertionError(error: Error): error is AssertionError {
  return error instanceof AssertionError;
}
