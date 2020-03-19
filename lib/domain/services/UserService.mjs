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

import LoginResults from '../constants/LoginResults';
import RemoteLoginResult from '../constants/RemoteLoginResult';
import LogoutResults from '../constants/LogoutResults';

class UserService {
  constructor({userRepository, tokenManager, barcodeTransformer}) {
    this.userRepository = userRepository;
    this.tokenManager = tokenManager;
    this.barcodeTransformer = barcodeTransformer;
  }

  login(id, token, password) {
    if (id && token) {
      return this._loginWithIdAndToken(id, token);
    } else if (id && password) {
      return this._loginWithIdAndPassword(id, password);
    } else {
      return this._onLoginFailure(LoginResults.FUCK);
    }
  }

  async _loginWithIdAndToken(id, token) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      return this._onLoginFailure(LoginResults.WRONG_ID);
    }

    const userHasValidToken = await this.tokenManager.compareBcryptToken(token, user.token);
    if (userHasValidToken) {
      return this._onLoginSuccess(id);
    }
  }

  async _loginWithIdAndPassword(id, password) {
    const remoteLoginResult = await this.userRepository.getRemoteLoginResult(id, password);

    const isSucceeded = (remoteLoginResult === RemoteLoginResult.SUCCESS);
    if (isSucceeded) {
      return this._onLoginSuccess(id);
    } else {
      return this._onLoginFailure(remoteLoginResult);
    }
  }

  _onLoginFailure(result) {
    return {
      result: result,
    };
  }

  async _onLoginSuccess(id) {
    await this.userRepository.addOrUpdateUser(id, {
      token: this.tokenManager.createRememberMeToken(),
      barcode: this.barcodeTransformer.generateBarcodeFromId(id),
    });

    await this.userRepository.updateLastLoginTimestamp(id);

    return {
      result: LoginResults.SUCCESS,
      jwt: this.tokenManager.createJwt({id: id}),
    };
  }

  logout(id) {
    if (id) {
      return this._logoutWithId(id);
    } else {
      return this._onLogoutFailure(LogoutResults.FUCK);
    }
  }

  async _logoutWithId(id) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      return this._onLogoutFailure(LoginResults.WRONG_ID);
    } else {
      return this._onLogoutSuccess(id);
    }
  }

  _onLogoutFailure(result) {
    return {
      result: result,
    };
  }

  async _onLogoutSuccess(id) {
    await this.userRepository.updateLastLogoutTimestamp(id);

    return {
      result: LogoutResults.SUCCESS,
    };
  }
}

export default UserService;
