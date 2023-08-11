import { iUserAuth } from './iUserAuth';

export interface iMessage {
  user: iUserAuth;
  token: string;
}
