import { Injectable } from '@angular/core';
import { CategoryModel } from 'src/models/category.model';
import { MenuModel } from 'src/models/menu.model';
import { BaseService } from './base.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService extends BaseService<MenuModel> {
  constructor(public override http: HttpService) {
    super('menus', http);
  }

  async getMenuByCompany(id: string): Promise<Array<MenuModel>> {
    let listMenu: Array<MenuModel> = new Array<MenuModel>();
    const url = `${this.urlBase}/company/${id}`;
    try {
      const result = await this.http.get(url);
      if (result.success) {
        listMenu = result.data.menuList as Array<MenuModel>;
      }
    } catch (error) {
      throw error;
    }
    return listMenu;
  }

  async getCategoryByCompany(id: string): Promise<Array<CategoryModel>> {
    const listCategory: Array<CategoryModel> = new Array<CategoryModel>();
    const url = `${this.urlBase}/company/${id}`;
    try {
      const result = await this.http.get(url);
      if (result.success) {
        const listMenuModel = result.data.menuList as Array<MenuModel>;
        console.log('ListMenuModel =', listMenuModel);
        listMenuModel.map((menu) => {
          console.log(menu.product.category.cateNmCategory);
          listCategory.push(menu.product.category);
        });
      }
    } catch (error) {
      throw error;
    }
    return listCategory;
  }
}
