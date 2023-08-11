import { BaseModel } from './base.model';
import { CompanyModel } from './company.model';
import { ProductModel } from './product.model';

export class MenuModel extends BaseModel {
  menuCdMenu: string;
  menuVlPrice: number;
  menuPrDiscount: number;
  menuPrDelivery: number;
  menuTxImage: string;
  menuPrCashback: number;
  menuDsDescriptor: string;
  menuVlRating: number;
  company: CompanyModel;
  product: ProductModel;

  constructor() {
    super();
    this.company = new CompanyModel();
    this.product = new ProductModel();
    this.menuCdMenu = '';
    this.menuVlPrice = 0;
    this.menuPrDiscount = 0;
    this.menuPrDelivery = 0;
    this.menuTxImage = '';
    this.menuPrCashback = 0;
    this.menuDsDescriptor = '';
    this.menuVlRating = 0;
  }
}
