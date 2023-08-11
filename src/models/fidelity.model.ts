import { BaseModel } from './base.model';
import { PromotionModel } from './promotion.model';
import { UserModel } from './user.model';

export class FidelityModel extends BaseModel {
  fideQnVoucher: number;
  fideInValidate: boolean;
  user: UserModel;
  promotion: PromotionModel;

  constructor() {
    super();
    this.user = new UserModel();
    this.promotion = new PromotionModel();
    this.fideQnVoucher = 0;
    this.fideInValidate = false;
  }
}
