import { AlertService } from './alert.service';
import { Injectable } from '@angular/core';
import { iResultHttp } from 'src/interfaces/iResultHttp';
import { SpinnerService } from './spinner.service';
import { CONSTANTS } from 'src/shared/constants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IParam } from 'src/interfaces/iParam';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private alertSrv: AlertService,
    private spinnerSrv: SpinnerService
  ) {}

  private createHeaders(params?: Array<IParam>): any {
    const token = localStorage.getItem(CONSTANTS.keyStore.token);
    let httpOptions: any = {};
    if (token) {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-token-access': token,
          // 'Access-Control-Allow-Origin': '*',
          // 'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
          // 'Access-Control-Allow-Headers': 'Content-Type',
        }),
        params: new HttpParams({}),
      };
    } else {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          // 'Access-Control-Allow-Origin': '*',
          // 'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
          // 'Access-Control-Allow-Headers': 'Content-Type',
        }),
        params: new HttpParams({}),
      };
    }

    // Setando os parâmetros

    if (params) {
      let listParams = new HttpParams();
      for (const param of params) {
        listParams = listParams.set(param.label, param.value);
      }
      httpOptions['params'] = listParams;
    }

    return httpOptions;
  }

  public async get(url: string, params?: Array<IParam>): Promise<iResultHttp> {
    const options = this.createHeaders(params);
    return new Promise(async (resolve) => {
      try {
        await this.spinnerSrv.Show();
        const res = await this.http.get(url, options).toPromise();
        await this.spinnerSrv.Hide();
        resolve({ success: true, data: res, error: undefined });
      } catch (error) {
        await this.spinnerSrv.Hide();
        resolve({ success: false, data: {}, error });
      } finally {
        await this.spinnerSrv.Hide();
      }
    });
  }

  public post(url: string, model: any): Promise<iResultHttp> {
    const options = this.createHeaders();
    return new Promise(async (resolve) => {
      try {
        await this.spinnerSrv.Show();
        const res = await this.http.post(url, model, options).toPromise();
        resolve({ success: true, data: res, error: undefined });
      } catch (error: any) {
        let errorText = '<ul>';
        if (Array.isArray(error.error)) {
          error.error.forEach((element: any) => {
            errorText += `<li style="text-align: left">${
              element.message || element
            }</li>`;
          });
          errorText += '</ul>';
          await this.alertSrv.alert('Atenção', errorText);
        }
        await this.spinnerSrv.Hide();
        resolve({ success: false, data: {}, error });
      } finally {
        await this.spinnerSrv.Hide();
      }
    });
  }

  public delete(url: string): Promise<iResultHttp> {
    const options = this.createHeaders();
    return new Promise(async (resolve) => {
      try {
        await this.spinnerSrv.Show();
        const res = await this.http.delete(url, options).toPromise();
        resolve({ success: true, data: res, error: undefined });
      } catch (error) {
        await this.spinnerSrv.Hide();
        resolve({ success: false, data: {}, error });
      } finally {
        await this.spinnerSrv.Hide();
      }
    });
  }
}
