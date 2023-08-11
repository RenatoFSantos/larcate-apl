import { BaseModel } from './base.model';

export class CategoryModel extends BaseModel {
  cateNmCategory: string;
  cateTxImage: string;

  constructor() {
    super();
    this.cateNmCategory = '';
    this.cateTxImage = '';
  }
}
