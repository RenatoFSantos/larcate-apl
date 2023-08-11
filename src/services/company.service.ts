import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { CompanyModel } from 'src/models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService extends BaseService<CompanyModel> {
  constructor(public override http: HttpService) {
    super('companies', http);
  }
}
