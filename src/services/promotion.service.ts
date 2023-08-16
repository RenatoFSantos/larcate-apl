import { AlertService } from './alert.service';
import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { PromotionModel } from 'src/models/promotion.model';
import { BaseService } from './base.service';
import { HttpService } from './http.service';
import { iResultHttp } from 'src/interfaces/iResultHttp';

@Injectable({
  providedIn: 'root',
})
export class PromotionService extends BaseService<PromotionModel> {
  constructor(public override http: HttpService) {
    super('promotions', http);
  }

  async getPromotionsByCompany(uid: string): Promise<iResultHttp> {
    const url = `${environment.apiPath}/promotions/company/${uid}`;
    try {
      return this.http.get(url);
    } catch (error) {
      return { success: false, data: undefined, error };
    }
  }
}
