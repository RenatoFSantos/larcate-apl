import { RefreshToken } from './RefreshToken';
import { Token } from './Token';

  export interface iAuth {
      token: Token;
      refreshToken: RefreshToken;
  }
