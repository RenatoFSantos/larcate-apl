import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { iResultHttp } from 'src/interfaces/iResultHttp';
import { FidelityModel } from 'src/models/fidelity.model';
import { VoucherModel } from 'src/models/voucher.model';
import { BaseService } from './base.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CashbackService extends BaseService<FidelityModel> {

  constructor(
    public http: HttpService
  ) {
    super('fidelities', http);
  }

  async getFidelityByUser(userUid: string): Promise<iResultHttp> {
    console.log('Entrei no getFidelityByUser');
    const url = `${environment.apiPath}/fidelities/${userUid}/user`;
    console.log('url = ', url);
    try {
      return await this.http.get(url);
    } catch (error) {
      return {success: false, data: {}, error};
    }
  }

  async getFidelityByUserPromotion(userUid: string, promotionUid: string): Promise<iResultHttp> {
    console.log('Entrei no getFidelityByUserPromotion');
    const url = `${environment.apiPath}/fidelities/${userUid}/user/${promotionUid}/promotion`;
    console.log('url = ', url);
    try {
      return await this.http.get(url);
    } catch (error) {
      return {success: false, data: {}, error};
    }
  }

  async generateVoucher(model: VoucherModel): Promise<iResultHttp> {
    const url = `${environment.apiPath}/voucher`;
    try {
      return await this.http.post(url, model);
    } catch (error) {
      return {success: false, data: {}, error};
    }
  }

  async save(model: FidelityModel): Promise<iResultHttp> {
    const url = `${environment.apiPath}/fidelities`;
    try {
      return await this.http.post(url, model);
    } catch (error) {
      return {success: false, data: {}, error};
    }
  }

}
