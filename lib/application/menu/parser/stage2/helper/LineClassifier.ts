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

export type RegexResult = RegExpExecArray | null;

/**
 * 어떤 스트링 한 줄이 들어왔을 때,
 * 해당 스트링이 현재 가지고 있는 targetRegex에 매치되면
 * 그대로 캡쳐하는 친구입니다.
 */
export default class LineClassifier {
  constructor(private readonly targetRegex: RegExp) {}

  private captured: RegexResult[] = [];

  /**
   * 들어온 라인이 매치되면 보관합니다.
   *
   * @param line 들어온 라인.
   * @return boolean 캡쳐하였으면 true.
   */
  captureIfMatches(line: string): boolean {
    const result = this.targetRegex.exec(line);

    if (result == null) {
      return false;
    }

    this.captured.push(result);

    return true;
  }

  getCapturedResults(): RegexResult[] {
    return this.captured;
  }
}
