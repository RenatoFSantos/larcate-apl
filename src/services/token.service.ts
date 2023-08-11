import { Injectable } from '@angular/core';
import { CONSTANTS } from 'src/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }
  signOut(): void {
    localStorage.clear();
  }

  public saveToken(token: string): void {
    localStorage.removeItem(CONSTANTS.keyStore.token);
    localStorage.setItem(CONSTANTS.keyStore.token, token);
    const user = this.getUser();
    if(user.id) {
      this.saveUser({ ...user, accessToken: token });
    }
  }

  public getToken(): string | null {
    return localStorage.getItem(CONSTANTS.keyStore.token);
  }

  public saveRefreshToken(token: string): void {
    localStorage.removeItem(CONSTANTS.keyStore.refreshtoken);
    localStorage.setItem(CONSTANTS.keyStore.refreshtoken, token);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(CONSTANTS.keyStore.refreshtoken);
  }

  public saveUser(user: any): void {
    localStorage.removeItem(CONSTANTS.keyStore.user);
    localStorage.setItem(CONSTANTS.keyStore.user, JSON.stringify(user));
  }

  public getUser(): any {
    const user = localStorage.getItem(CONSTANTS.keyStore.user);
    if(user) {
      return JSON.parse(user);
    }
    return {};
  }

}
