/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2021 INU Global App Center <potados99@gmail.com>
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

export type UserIdentifier = {
  userId: number;
};

export type StudentId = {
  studentId: string;
};

export type PhoneNumber = {
  phoneNumber: string;
};

export type Session = {
  jwt: string;
  rememberMeToken: string;
  barcode?: string; // 학생 전용
};

export type SessionTokenContents = {
  userId: number;
};
