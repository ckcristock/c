import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsecutivosService {

  constructor(private http: HttpClient) { }

  paginate(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-comprobante-consecutivo`, { params });
  }
}
