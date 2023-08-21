import { Injectable } from '@angular/core';
import { PromotionModel } from 'src/models/promotion.model';
import { BaseService } from './base.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class PromotionService extends BaseService<PromotionModel> {
  constructor(public override http: HttpService) {
    super('promotions', http);
  }

  async getPromotionsByCompany(uid: string): Promise<Array<PromotionModel>> {
    let listPromotion: Array<PromotionModel> = new Array<PromotionModel>();
    const url = `${this.urlBase}/company/${uid}`;
    try {
      const result = await this.http.get(url);
      if (result.success) {
        listPromotion = result.data.resourceList as Array<PromotionModel>;
      }
    } catch (error) {
      throw error;
    }
    return listPromotion;
  }
}
