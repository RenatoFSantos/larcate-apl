import { iResultHttp } from './../interfaces/iResultHttp';
import { LoginModel } from './../models/login.model';
import { Injectable } from '@angular/core';
import { UserModel } from 'src/models/user.model';
import { BaseService } from './base.service';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';
import { CONSTANTS } from 'src/shared/constants';
import { iAuth } from 'src/interfaces/iAuth';
import { from, Observable, of, scheduled, Subject } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<UserModel> {
  private subUserData: Subject<UserModel> = new Subject<UserModel>();

  constructor(
    public override http: HttpService,
    public tokenService: TokenService
  ) {
    super('users', http);
  }

  async login(user: UserModel): Promise<iResultHttp> {
    console.log('Fazendo login =', user);
    try {
      return await this.http.post(`${environment.apiPath}/users/auth`, user);
    } catch (error) {
      return { success: false, data: undefined, error };
    }
  }

  async save(user: UserModel): Promise<iResultHttp> {
    try {
      return await this.http.post(`${environment.apiPath}/users`, user);
    } catch (error) {
      return { success: false, data: undefined, error };
    }
  }

  async validEmail(email: any): Promise<iResultHttp> {
    try {
      return await this.http.get(`${environment.apiPath}/users/email/${email}`);
    } catch (error) {
      return { success: false, data: undefined, error };
    }
  }

  async sendEmail(user: UserModel): Promise<iResultHttp> {
    try {
      return await this.http.post(
        `${environment.apiPath}/users/sendEmail`,
        user
      );
    } catch (error) {
      return { success: false, data: undefined, error };
    }
  }

  saveDataLoginInfo(data: iAuth) {
    localStorage.setItem(
      CONSTANTS.keyStore.user,
      JSON.stringify(data.token.message.user)
    );
    localStorage.setItem(CONSTANTS.keyStore.token, data.token.message.token);
    localStorage.setItem(
      CONSTANTS.keyStore.refreshtoken,
      data.refreshToken.uid
    );
    localStorage.setItem(
      CONSTANTS.keyStore.profile,
      data.token.message.user.userCdType === 'A'
        ? 'Administrador'
        : data.token.message.user.userCdType === 'M'
        ? 'Fornecedor'
        : 'Cliente'
    );
    this.subUserData.next(this.userData);
  }

  userIsLogged(): boolean {
    return localStorage.getItem(CONSTANTS.keyStore.profile) !== null;
  }

  desconecta() {
    // localStorage.removeItem(CONSTANTS.keyStore.user);
    // localStorage.removeItem(CONSTANTS.keyStore.profile);
    // localStorage.removeItem(CONSTANTS.keyStore.token);
    // localStorage.removeItem(CONSTANTS.keyStore.refreshtoken);
    this.tokenService.signOut();
    this.subUserData.next(this.userData);
  }

  get userDataAsync(): Observable<UserModel> {
    setTimeout(() => {
      this.subUserData.next(this.userData);
    }, 1000);
    return this.subUserData.asObservable();
  }

  get userData(): UserModel {
    try {
      const saved = localStorage.getItem(CONSTANTS.keyStore.user);
      if (saved) {
        return JSON.parse(saved) as UserModel;
      } else {
        return {} as UserModel;
      }
    } catch (error) {
      return {} as UserModel;
    }
  }
}
