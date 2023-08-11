import { BaseModel } from './base.model';
import { CategoryModel } from './category.model';

export class ProductModel extends BaseModel {
  prodCdStandard: string;
  prodNmProduct: string;
  prodDsProduct: string;
  prodDsRecipe: string;
  prodTxImage: string;
  prodDsDescriptor: string;
  category: CategoryModel;

  constructor() {
    super();
    this.category = new CategoryModel();
    this.prodCdStandard = '';
    this.prodNmProduct = '';
    this.prodDsProduct = '';
    this.prodDsRecipe = '';
    this.prodTxImage = '';
    this.prodDsDescriptor = '';
  }
}
