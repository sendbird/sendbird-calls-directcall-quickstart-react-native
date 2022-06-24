import { SimpleStorage, createStorage } from './createStorage';

interface Token {
  value: string;
  type: 'fcm' | 'apns' | 'voip';
}

class TokenManager {
  private _token: Token | null = null;
  private _storage: SimpleStorage<Token> = createStorage('calls@tokenManager');

  get token() {
    return this._token;
  }

  async get() {
    this._token = await this._storage.get();
    return this._token;
  }

  set(token: Token | null) {
    this._token = token;
    return this._storage.update(this._token);
  }
}

export default new TokenManager();
