import { environment } from 'src/environments/environment';
import { iResultHttp } from 'src/interfaces/iResultHttp';
import { HttpService } from './http.service';

export abstract class BaseService<T> {
  urlBase: string = '';

  constructor(public url: string, public http: HttpService) {
    this.urlBase = `${environment.apiPath}/${this.url}`;
  }

  public getAll(): Promise<iResultHttp> {
    return this.http.get(this.urlBase);
  }

  public getById(id: string): Promise<iResultHttp> {
    return this.http.get(`${this.urlBase}/${id}`);
  }

  public post(model: T): Promise<iResultHttp> {
    return this.http.post(this.urlBase, model);
  }

  public delete(id: string): Promise<iResultHttp> {
    return this.http.delete(`${this.urlBase}/${id}`);
  }
}
