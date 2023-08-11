import { ProfileType } from './enum/ProfileType';

export class LoginModel {
  uid: string;
  userNmName: string;
  userNmLastname: string;
  userDtBirthdate: Date;
  userSgUser: string;
  userDsEmail: string;
  userCdPassword: string;
  userCdType: ProfileType;
  userTxAvatar: string;

  constructor() {
    this.uid = '';
    this.userNmName = '';
    this.userNmLastname = '';
    this.userDtBirthdate = new Date();
    this.userSgUser = '';
    this.userDsEmail = '';
    this.userCdPassword = '';
    this.userCdType = ProfileType.C;
    this.userTxAvatar = '';
  }
}
