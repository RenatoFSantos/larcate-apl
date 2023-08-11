import { BaseModel } from './base.model';

export class UserModel extends BaseModel {
  userSgUser: string;
  userNmName: string;
  userNmLastname: string;
  userDtBirthdate: Date;
  userDsEmail: string;
  userDsPhone: string;
  userDsSmartphone: string;
  userDsWhatsapp: string;
  userCdPassword: string;
  userCdType: string;
  userTxAvatar: string;
  userVlCashback: string;
  userVlScore: string;
  userVlRating: string;

  constructor() {
    super();
    this.userSgUser = '';
    this.userNmName = '';
    this.userNmLastname = '';
    this.userDtBirthdate = new Date();
    this.userDsEmail = '';
    this.userDsPhone = '';
    this.userDsSmartphone = '';
    this.userDsWhatsapp = '';
    this.userCdPassword = '';
    this.userCdType = '';
    this.userTxAvatar = '';
    this.userVlCashback = '';
    this.userVlScore = '';
    this.userVlRating = '';
  }
}
